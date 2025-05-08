// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { OrderModule } from './c1-order/module';
import { SaleModule } from './c2-sale/module';

export const cashierRoutes: Routes = [
    {
        path: 'ordering',
        module: OrderModule
    },
    {
        path: 'sales',
        module: SaleModule
    },
];