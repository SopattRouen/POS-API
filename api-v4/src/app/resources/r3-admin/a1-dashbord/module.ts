import { Module } from '@nestjs/common';
import { DashboardController } from './controller';
import { DashboardService } from './service';
import { JsReportService } from '@app/services/js-report.service';

@Module({
    controllers: [DashboardController],
    providers: [DashboardService, JsReportService]
})
export class DashboardModule { }
