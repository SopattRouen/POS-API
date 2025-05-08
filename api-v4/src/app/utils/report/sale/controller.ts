// ===> core library
import { Controller, Get, Query }   from "@nestjs/common";
// ===> custom library
import UserDecorator                from "@app/core/decorators/user.decorator";
import User                         from "@app/models/user/user.model";
import { SaleReportService }        from "./service";

@Controller()
export class SaleReportController {
    constructor(
        private readonly _service: SaleReportService
    ) { };

    @Get('generate-sale-report')
    async generateCashierReportInDay(
        
        @UserDecorator() auth: User,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('report_type') report_type: string
    ) {
        console.log('report_type', report_type);
        return this._service.generate(auth.id, startDate, endDate, report_type);
    }
}