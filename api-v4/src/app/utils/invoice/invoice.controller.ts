// ===========================================================================>> Core Library
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { InvoiceService } from './invoice.service';

@Controller()
export class InvoiceController {
    
    constructor(private readonly _service: InvoiceService) { };

    @Get('order-invoice/:receiptNumber')
    async generateReport(@Param('receiptNumber') receiptNumber: number) {
        if (isNaN(receiptNumber)) {
            throw new BadRequestException('Id must be a number');
        }
        return this._service.generateReport(receiptNumber);
    }
}
