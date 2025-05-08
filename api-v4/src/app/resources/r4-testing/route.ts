// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { BasicModule } from './basic/module';
import { SMSModule } from './third-party/sms/module';
import { TelegramModule } from './third-party/telegram/module';
import { ReportJSModule } from './third-party/report/module';

export const testingRoutes: Routes = [
    {
        path: 'basic',
        module: BasicModule
    }, 

    {
        path: 'telegram',
        module: TelegramModule
    }, 
    {
        path: 'sms',
        module: SMSModule
    },
    {
        path: 'report',
        module: ReportJSModule
    }
];