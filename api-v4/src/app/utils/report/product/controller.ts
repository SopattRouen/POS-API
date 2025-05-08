//===>core library
import { Controller, Get, Query }   from "@nestjs/common";
//===>custom library
import { ProductReportService }     from "./service";
import UserDecorator                from "@app/core/decorators/user.decorator";
import User                         from "@app/models/user/user.model";

@Controller()
export class ProductReportController {
    constructor(private readonly _service: ProductReportService) { };



    @Get('generate-product-report')
    async getData(
        
        // @Query('page')              page?       : number,
        // @Query('limit')             limit?      : number,
        // @Query('key')               key?        : string,
        // @Query('type')              type?       : number,
        // @Query('creator')           creator?    : number,
        @UserDecorator() auth: User,
        @Query('startDate')         startDate?     : string,
        @Query('endDate')           endDate?       : string,
        // @Query('sort_by')           sort_by?    : string,
        // @Query('order')             order?      : string,
        @Query('report_type')       report_type?   : string, 

    ) {

        // Set defaul value if not defined. 
        // page = !page   ?   10   : page;
        // limit = !limit ?   10   : limit;
        // key = key === undefined ? null : key;
        report_type = !report_type ? 'PDF' : report_type;

        const params = {
            // page,limit, key, type, creator,
            
             startDate, endDate, 
            // sort_by, order,
        }

        return await this._service.generate(auth.id,startDate,endDate, report_type);
    }

}