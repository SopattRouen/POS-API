// =========================================================================>> Core Library
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// =========================================================================>> Custom Library
import { DeviceTrackerMiddleware } from '@app/core/middlewares/device-tracker.middleware';
import { AuthModule } from './a1-auth/module';
import { ProfileModule } from './a2-profile/module';

@Module({
    imports: [
        AuthModule,
        ProfileModule
    ]
})
export class AccountModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(DeviceTrackerMiddleware)
            .forRoutes('*');
    }
}