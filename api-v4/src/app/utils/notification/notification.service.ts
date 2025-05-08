// ================================================================>> Core Library
import Notifications from '@app/models/notification/notification.model';
import Order from '@app/models/order/order.model';
import User from '@app/models/user/user.model';
import { Injectable, NotFoundException } from '@nestjs/common';
// ================================================================>> Costom Library

@Injectable()
export class NotificationService {

    async getData() {
        try {
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

            // Format the result to match the Notification interface
            const data = notifications.map(notification => ({
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

            return { data };
        } catch (err) {
            console.error('Error fetching notifications:', err);
            throw new Error('Unable to fetch notifications.');
        }
    }

    async toggleReadStatus(id: number) {
        const notification = await Notifications.findByPk(id);

        if (!notification) {
            throw new NotFoundException(`Notification with ID ${id} not found`);
        }

        // Toggle the read status
        notification.read = !notification.read;
        await notification.save();

        // Fetch all notifications and format them
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
        });

        // Format the result to match the Notification interface
        const data = notifications.map(notification => ({
            id: notification.id,
            receipt_number: notification.order.receipt_number,
            total_price: notification.order.total_price,
            ordered_at: notification.order.ordered_at,
            cashier: {
                id: notification.user.id,
                name: notification.user.name,
                avatar: notification.user.avatar,
            },
            read: notification.read,
        }));

        // Return the updated data to the frontend
        return { data };
    }

    async deleteNotification(id: number) {
        const notification = await Notifications.findByPk(id);

        // If the notification does not exist, throw a NotFoundException
        if (!notification) {
            throw new NotFoundException(`Notification with ID ${id} not found`);
        }
        // Delete the notification
        await notification.destroy();
        return { message: "Nofification deleted successfully." };
    }

}
