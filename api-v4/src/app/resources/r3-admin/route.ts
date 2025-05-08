// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { DashboardModule }      from './a1-dashbord/module';
import { SaleModule }           from './a2-sale/module';
import { ProductModule }        from './a3-product/p1-product/module';
import { ProductTypeModule }    from './a3-product/p2-type/module';
import { UserModule }           from './a4-user/module';

export const adminRoutes: Routes = [
    {
        path: 'dashboard',
        module: DashboardModule
    },
    {
        path: 'sales',
        module: SaleModule
    },
    {
        path: 'products',
        module: ProductModule
    },
    {
        path: 'products/types',
        module: ProductTypeModule
    },
   
    {
        path: 'users',
        module: UserModule
    },
];