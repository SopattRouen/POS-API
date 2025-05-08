// ===========================================================================>> Core Library
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { ConfigModule } from '../config/config.module';
import { AppController } from './app.controller';
import { appRoutes } from './app.routes';
import { ExceptionErrorsFilter } from './core/exceptions/errors.filter';
import { TimeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { JwtMiddleware } from './core/middlewares/jwt.middleware';
import { AccountModule } from './resources/r1-account/module';
import { AdminModule } from './resources/r3-admin/module';
import { CashierModule } from './resources/r2-cashier/module';
import { UtilsModule } from './utils/utils.module';

import { BasicModule } from './resources/r4-testing/basic/module';
import { ReportJSModule } from './resources/r4-testing/third-party/report/module';
import { SMSModule } from './resources/r4-testing/third-party/sms/module';
import { TelegramModule } from './resources/r4-testing/third-party/telegram/module';


// ======================== >> Code Starts Here << ========================== //
@Module({
    controllers: [
        AppController
    ],
    imports: [

        ConfigModule,

        //===================== ROLE ACCOUNT
        AccountModule,

        //===================== ROLE ADMIN
        AdminModule,

        //===================== ROLE Cashier
        CashierModule,

        //===================== Share Utils
        UtilsModule,

        //===================== Testing
        BasicModule,
        TelegramModule,
        SMSModule,
        ReportJSModule,

        //===================== END OF ROLE USER
        RouterModule.register(appRoutes)
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ExceptionErrorsFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor
        }
    ]
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware)
            .exclude(
                { path: '', method: RequestMethod.GET },
                { path: 'api/account/auth/(.*)', method: RequestMethod.POST },
                { path: 'api/testing/(.*)', method: RequestMethod.ALL }, 
            ).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}