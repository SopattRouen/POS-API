// =========================================================================>> Core Library
import { Module } from '@nestjs/common';
import { ReportController } from './controller';
import { ReportService } from './service';

// =========================================================================>> Custom Library

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [ReportController],
    providers: [ReportService]
})
export class ReportJSModule { }
