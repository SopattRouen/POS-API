// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { NotificationsGateway } from '@app/utils/notification-getway/notifications.gateway';
import { TelegramService } from 'src/app/services/telegram.service';
import { OrderController } from './controller';
import { OrderService } from './service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [OrderController],
    providers: [OrderService, TelegramService, NotificationsGateway]
})
export class OrderModule { }
