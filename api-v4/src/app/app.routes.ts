// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { accountRoutes } from './resources/r1-account/route';
import { cashierRoutes } from './resources/r2-cashier/route';
import { adminRoutes } from './resources/r3-admin/route';

import { utilsRoutes } from './utils/utils.routes';

import { testingRoutes } from './resources/r4-testing/route';

export const appRoutes: Routes = [{
    path: 'api',
    children: [
        {
            path: 'account',
            children: accountRoutes
        },
        {
            path: 'admin',
            children: adminRoutes
        },
        {
            path: 'cashier',
            children: cashierRoutes
        },
        {
            path: 'share',
            children: utilsRoutes
        },

        {
            path: 'testing',// Start
            children: testingRoutes
        },
    ]
}];