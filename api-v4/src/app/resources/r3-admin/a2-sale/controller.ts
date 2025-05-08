// ===========================================================================>> Core Library
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { SaleService }                                                 from './service';
@Controller()
export class SaleController {

    constructor(private readonly _service: SaleService) { };

    @Get('/setup')
    async getSetupData(){
        return await this._service.getSetupData();
    }
    
    @Get('/')
    async getData(

        //=========================>> Pagination
        @Query('page')    page?  : number,
        @Query('limit')   limit? : number,

        //=========================>> Search
        @Query('key')     key?   : string,

        //=========================>> Sort
        @Query("sort")      sort?  : string,
        @Query("order")     order?    : string,
        
        //=========================>> Filter
        @Query('cashier')   cashier?    : number,
        @Query('platform')  platform?   : string,
        @Query('from')      from?       : string,      
        @Query('to')        to?         : string,
        
    ) {

       // Set default value if not defined. 
        page    = !page ? 10: page; 
        limit   = !limit ? 10: limit;

        const fromDate  = from; 
        const toDate    = to ? to + ' 23:59:59' : undefined;

        const params = { 
            // ===>> Pagination
            page, 
            limit,

            // ===>> Filter
            key,
            cashier,
            platform,
            fromDate, 
            toDate,

            // ===>> Sort
            sort,
            order
        }

        return await this._service.getData(params);
    }
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return await this._service.delete(id);
    }
}