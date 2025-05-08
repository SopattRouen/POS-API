// ===========================================================================>> Core Library
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// ===========================================================================>> Third party Library
import { Op, Sequelize } from 'sequelize';
// ===========================================================================>> Costom Library
import OrderDetails from '@app/models/order/detail.model';
import Product from '@app/models/product/product.model';
import ProductType from '@app/models/product/type.model';
import User from '@app/models/user/user.model';
import Order from 'src/app/models/order/order.model';
import { List } from './interface';

@Injectable()
export class SaleService {

    async getUser() {
        const data = await User.findAll({
            attributes: ['id', 'name']
        })

        return { data: data };
    }

    async getData(userId: number, page_size: number = 10, page: number = 1, key?: string, platform?: string, startDate?: string, endDate?: string) {
        try {
            const offset = (page - 1) * page_size;

            // Helper function to convert date to Cambodia's timezone (UTC+7)
            const toCambodiaDate = (dateString: string, isEndOfDay = false): Date => {
                const date = new Date(dateString);
                const utcOffset = 7 * 60; // UTC+7 offset in minutes
                const localDate = new Date(date.getTime() + utcOffset * 60 * 1000);

                if (isEndOfDay) {
                    localDate.setHours(23, 59, 59, 999); // End of day
                } else {
                    localDate.setHours(0, 0, 0, 0); // Start of day
                }
                return localDate;
            };

            // Calculate start and end dates for the filter
            const start = startDate ? toCambodiaDate(startDate) : null;
            const end = endDate ? toCambodiaDate(endDate, true) : null;

            // Build the dynamic `where` clause with filters
            const where: any = {
                cashier_id: userId,
                [Op.and]: [
                    key
                        ? Sequelize.where(
                            Sequelize.literal(`CAST("receipt_number" AS TEXT)`),
                            { [Op.like]: `%${key}%` }
                        )
                        : null,
                    platform !== null && platform !== undefined
                        ? { platform }
                        : null,
                    start && end
                        ? { ordered_at: { [Op.between]: [start, end] } }
                        : null,
                ].filter(Boolean), // Remove null or undefined filters
            };

            const data = await Order.findAll({
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
                where: where,
                order: [['ordered_at', 'DESC']],
                limit: page_size,
                offset,
            });

            const totalCount = await Order.count({
                where: where,
            });

            const totalPages = Math.ceil(totalCount / page_size);

            const dataFormat: List = {
                status: 'success',
                data: data,
                pagination: {
                    page: page,
                    limit: page_size,
                    totalPage: totalPages,
                    total: totalCount,
                },
            };

            return dataFormat;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async view(id: number) {
        try {
            const data = await Order.findByPk(id, {
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
            });

            const dataFormat = {
                status: 'success',
                data: data,
            };

            return dataFormat;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async delete(id: number): Promise<{ message: string }> {
        try {
            const rowsAffected = await Order.destroy({
                where: {
                    id: id
                }
            });

            if (rowsAffected === 0) {
                throw new NotFoundException('Sale record not found.');
            }

            return { message: 'This order has been deleted successfully.' };
        } catch (error) {
            throw new BadRequestException(error.message ?? 'Something went wrong!. Please try again later.', 'Error Delete');
        }
    }
}
