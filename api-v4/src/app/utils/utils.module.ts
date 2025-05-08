// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Custom Library
import { InvoiceModule } from './invoice/invoice.module';
import { NotificationGetwayModule } from './notification-getway/notifications.gateway.module';
import { NotificationModule } from './notification/notification.module';
import { ReportModule } from './report/module';


@Module({
    imports: [
        InvoiceModule,
        NotificationModule,
        NotificationGetwayModule,
        ReportModule
    ]
})

export class UtilsModule {}