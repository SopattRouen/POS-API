// =========================================================================>> Core Library
import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';

// =========================================================================>> Custom Library
import { GenerateReportDto } from './dto';
import { ReportService } from './service';

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class ReportController {

    constructor(private readonly _service: ReportService) { };

    // ====================================================>> Sum 1
    @Get('me')
    async getMe(): Promise<{ result: number }> {

        return await this._service.getMe();

    }
    @Post('generate-report')
    async generateReport(@Body() body: GenerateReportDto): Promise<any> {
        const { username, password, baseURL, template, data } = body;
        const result = await this._service.generateReport(username, password, baseURL, template, data);
        if (result.error) {
            throw new BadRequestException(result.error);
        }
        return { report: result.data };
    }

}
