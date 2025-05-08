import OrderDetails from "@app/models/order/detail.model";
import Order from "@app/models/order/order.model";
import Product from "@app/models/product/product.model";

export class OrderSeeder {
    public static async seed() {
        try {
            await OrderSeeder.clearExistingOrders();
            await OrderSeeder.seedOrders();
            await OrderSeeder.seedOrderDetails();
        } catch (error) {
            console.error('\x1b[31m\nError seeding data for orders:', error);
        }
    }

    private static async clearExistingOrders() {
        try {
            const orders = await Order.findAll();
            for (const order of orders) {
                await order.destroy();
            }
            console.log('\x1b[32mExisting orders cleared successfully.');
        } catch (error) {
            console.error('Error clearing existing orders:', error);
            throw error;
        }
    }

    private static async seedOrders() {
        const ordersData = [];

        for (let i = 1; i <= 100; i++) {
            const receiptNumber = await OrderSeeder.generateReceiptNumber();
            ordersData.push({
                receipt_number      : receiptNumber+'',
                cashier_id          : Math.floor(Math.random() * (4 - 1) + 1),
                total_price         : 0,
                ordered_at          : new Date(),
            });
        }

        try {

            await Order.bulkCreate(ordersData);
            console.log('\x1b[32mOrders data inserted successfully.');

        } catch (error) {

            console.error('Error seeding orders:', error);
            throw error;

        }
    }

    private static async seedOrderDetails() {
        try {

            const orders = await Order.findAll();

            for (const order of orders) {

                const orderDetails = await OrderSeeder.createOrderDetails(order.id);
                const totalPrice = orderDetails.reduce((total, detail) => total + (detail.unit_price || 0) * (detail.qty || 0), 0);

                await OrderDetails.bulkCreate(orderDetails);
                await order.update({ total_price: totalPrice });
            }

            console.log('\x1b[32mOrder details inserted successfully.');
        } catch (error) {
            console.error('Error seeding order details:', error);
            throw error;
        }
    }

    private static async createOrderDetails(orderId: number) {

        const details       = [];
        const nOfDetails     = Math.floor(Math.random() * (7 - 2 + 1) + 2);

        const products = await Product.findAll();
        const productIds = products.map(product => product.id);

        for (let i = 0; i < nOfDetails; i++) {
            const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];
            const product = products.find(p => p.id === randomProductId);

            if (!product) {
                console.error(`Product with id ${randomProductId} not found.`);
                continue;
            }

            const qty = Math.floor(Math.random() * 10) + 1;

            details.push({
                order_id    : orderId,
                product_id  : product.id,
                unit_price  : product.unit_price,
                qty         : qty,
            });
        }

        return details;
    }


    private static async generateReceiptNumber() {

        const number        = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const existingOrder = await Order.findOne({ where: { receipt_number: number+'' } });

        if (existingOrder) {

            return this.generateReceiptNumber();
            
        }

        return number;
    }
}
