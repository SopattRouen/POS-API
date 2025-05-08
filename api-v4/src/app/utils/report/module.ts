// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { ProductReportController,} from './product/controller';
import { ProductPDFService } from './product/pdf-service';
import { ProductExcelReportService } from './product/excel-service';
import { ProductReportService } from './product/service';
import { CashierReportController } from './cashier/controller';
import { CashierReportService } from './cashier/service';
import { CashierPDFReportService } from './cashier/pdf-service';
import { CashierExcelReportService } from './cashier/excel-service';
import { SalePDFReportService } from './sale/pdf-service';
import { SaleExcelReportService } from './sale/excel-service';
import { SaleReportController } from './sale/controller';
import { SaleReportService } from './sale/service';
// ===> third party library
import { JsReportService } from 'src/app/services/js-report.service';

@Module({
    // controllers: [ReportController],
    controllers: [
        ProductReportController,
        CashierReportController,
        SaleReportController,
    ],
    // providers: [ReportService, JsReportService, TelegramService],
    providers:[
        ProductPDFService,
        ProductExcelReportService,
        ProductReportService,
        CashierReportService,
        JsReportService,
        CashierPDFReportService,
        CashierExcelReportService,
        SalePDFReportService,
        SaleExcelReportService,
        SaleReportService, // Add SaleReportService to the providers array
    ],
    imports: []
})
export class ReportModule { }
