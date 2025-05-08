// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { JsReportService } from 'src/app/services/js-report.service';

@Module({
    controllers: [InvoiceController],
    providers: [InvoiceService, JsReportService],
    imports: []
})
export class InvoiceModule { }
