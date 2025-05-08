// =========================================================================>> Core Library
import { BadRequestException, Injectable } from '@nestjs/common';

// =========================================================================>> Third Party Library
import { Sequelize, Transaction } from 'sequelize';

// =========================================================================>> Custom Library
import { NotificationsGateway } from '@app/utils/notification-getway/notifications.gateway';
import Notifications from '@app/models/notification/notification.model';
import User from '@app/models/user/user.model';
import { TelegramService } from 'src/app/services/telegram.service';
import sequelizeConfig from 'src/config/sequelize.config';
import OrderDetails from 'src/app/models/order/detail.model';
import Order from 'src/app/models/order/order.model';
import Product from 'src/app/models/product/product.model';
import ProductType from 'src/app/models/product/type.model';
import { CreateOrderDto } from './dto';

// ======================================= >> Code Starts Here << ========================== //
@Injectable()
export class OrderService {

    constructor(private telegramService: TelegramService,
        private readonly notificationsGateway: NotificationsGateway,
    ) { };

    async getProducts(): Promise<{ data: { id: number, name: string, products: Product[] }[] }> {
        const data = await ProductType.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: Product,
                    attributes: ['id', 'type_id', 'name', 'image', 'unit_price', 'code'],
                    include: [
                        {
                            model: ProductType,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            order: [['name', 'ASC']],
        });

        const dataFormat: { id: number, name: string, products: Product[] }[] = data.map(type => ({
            id: type.id,
            name: type.name,
            products: type.products || []
        }));

        return { data: dataFormat };
    }

    // Method for creating an order
    async makeOrder(cashierId: number, body: CreateOrderDto): Promise<{ data: Order, message: string }> {
        // Initializing DB Connection
        const sequelize = new Sequelize(sequelizeConfig);
        let transaction: Transaction;

        try {
            // Open DB Connection
            transaction = await sequelize.transaction();

            // Create an order using method create()
            const order = await Order.create({
                cashier_id: cashierId,
                platform: body.platform,
                total_price: 0, // Initialize with 0, will update later
                receipt_number: await this._generateReceiptNumber(),
                ordered_at: null, // Will be updated later
            }, { transaction });

            // Find Total Price & Order Details
            let totalPrice = 0;
            const cartItems = JSON.parse(body.cart); // Assuming cart is a JSON string

            // Loop through cart items and calculate total price
            for (const [productId, qty] of Object.entries(cartItems)) {
                const product = await Product.findByPk(parseInt(productId)); // Find product by its ID

                if (product) {
                    // Save to Order Details
                    await OrderDetails.create({
                        order_id: order.id,
                        product_id: product.id,
                        qty: Number(qty),
                        unit_price: product.unit_price,
                    }, { transaction });

                    totalPrice += Number(qty) * product.unit_price; // Add to total price
                }
            }

            // Update Order with total price and ordered_at timestamp
            await Order.update({
                total_price: totalPrice,
                ordered_at: new Date(),
            }, {
                where: { id: order.id },
                transaction,
            });

            // Create notification for this order
            await Notifications.create({
                order_id: order.id,
                user_id: cashierId,
                read: false,
            }, { transaction });

            // Get order details for client response
            const data: Order = await Order.findByPk(order.id, {
                attributes: ['id', 'receipt_number', 'total_price', 'platform', 'ordered_at'],
                include: [
                    {
                        model: OrderDetails,
                        attributes: ['id', 'unit_price', 'qty'],
                        include: [
                            {
                                model: Product,
                                attributes: ['id', 'name', 'code', 'image'],
                                include: [
                                    {
                                        model: ProductType,
                                        attributes: ['name'],
                                    }
                                ]
                            },
                        ],
                    },
                    {
                        model: User,
                        attributes: ['id', 'avatar', 'name'],
                    },
                ],
                transaction, // Ensure this is inside the same transaction
            });

            // Commit transaction after successful operations
            await transaction.commit();
            const currentDateTime = await this.getCurrentDateTimeInCambodia();
            let htmlMessage = `<b>ការបញ្ជាទិញទទួលបានជោគជ័យ!</b>\n`;
            htmlMessage += `-លេខវិកយប័ត្រ`;
            htmlMessage += `\u2003៖ ${data.receipt_number}\n`;
            htmlMessage += `-តម្លៃសរុប​​​​`;
            htmlMessage += `\u2003\u2003\u2003៖ ${this.formatPrice(data.total_price)} ៛\n`;
            htmlMessage += `-អ្នកគិតលុយ`;
            htmlMessage += `\u2003\u2003 ៖ ${data.cashier?.name || ''}\n`;
            htmlMessage += `-តាមរយះ`;
            htmlMessage += `\u2003\u2003\u2003 ៖ ${body.platform || ''}\n`;
            htmlMessage += `-កាលបរិច្ឆេទ\u2003\u2003៖ ${currentDateTime}\n`;

            // Send
            await this.telegramService.sendHTMLMessage(htmlMessage);

            const notifications = await Notifications.findAll({
                attributes: ['id', 'read'],
                include: [
                    {
                        model: Order,
                        attributes: ['id', 'receipt_number', 'total_price', 'ordered_at'],
                    },
                    {
                        model: User,
                        attributes: ['id', 'avatar', 'name'],
                    },

                ],
                order: [['id', 'DESC']],
            });
            const dataNotifications = notifications.map(notification => ({
                id: notification.id,
                receipt_number: notification.order.receipt_number,
                total_price: notification.order.total_price,
                ordered_at: notification.order.ordered_at,
                cashier: {
                    id: notification.user.id,
                    name: notification.user.name,
                    avatar: notification.user.avatar
                },
                read: notification.read
            }));
            this.notificationsGateway.sendOrderNotification({ data: dataNotifications });
            return { data, message: 'ការបញ្ជាទិញត្រូវបានបង្កើតដោយជោគជ័យ។' };

        } catch (error) {
            if (transaction) {
                await transaction.rollback(); // Rollback transaction on error
            }
            console.error('Error during order creation:', error);
            throw new BadRequestException('Something went wrong! Please try again later.', 'Error during order creation.');
        } finally {
            // Close DB connection if necessary
            await sequelize.close(); // Close sequelize connection
        }
    }

    private formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    }

    private async getCurrentDateTimeInCambodia(): Promise<string> {
        const now = new Date();

        // Options for Cambodia time zone with 12-hour format
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Phnom_Penh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Use 12-hour format with AM/PM
        };

        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(now);

        // Extract date and time components
        const day = parts.find(p => p.type === 'day')?.value;
        const month = parts.find(p => p.type === 'month')?.value;
        const year = parts.find(p => p.type === 'year')?.value;
        const hour = parts.find(p => p.type === 'hour')?.value;
        const minute = parts.find(p => p.type === 'minute')?.value;
        const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value; // AM/PM

        // Short date format: dd/mm/yyyy hh:mm AM/PM
        return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}`;
    }

    // Private method to generate a unique receipt number
    private async _generateReceiptNumber(): Promise<string> {

        const number = Math.floor(Math.random() * 9000000) + 1000000;

        return await Order.findOne({
            where: {
                receipt_number: number+'',
            },
        }).then((order) => {

            if (order) {
                return this._generateReceiptNumber() + '';
            }

            return number + '';
        });
    }
}
