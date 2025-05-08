// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { SaleService } from './service';
import { SaleController } from './controller';

@Module({
    providers: [SaleService],
    controllers: [SaleController],
    imports: []
})
export class SaleModule { }
