// ===========================================================================>> Core Library
import { InvoiceModule } from './invoice/invoice.module';

// ===========================================================================>> Custom Library
import { Routes } from '@nestjs/core';
import { NotificationGetwayModule } from './notification-getway/notifications.gateway.module';
import { NotificationModule } from './notification/notification.module';
import { ReportModule } from './report/module';


export const utilsRoutes: Routes = [
    {
        path: 'print',
        module: InvoiceModule
    },
    {
        path: 'notifications',
        module: NotificationModule
    },
    {
        path: 'notifications-getway',
        module: NotificationGetwayModule
    },
    {
        path: 'report',
        module: ReportModule
    },
];