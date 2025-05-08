//===> core library
import { Injectable } from "@nestjs/common";
//===> custom library
import { ProductPDFService }         from "./pdf-service";
import { ProductExcelReportService } from "./excel-service";

@Injectable()
export class ProductReportService {

    constructor(
        private readonly _productPDFservice  : ProductPDFService,
        private readonly _productExcelService: ProductExcelReportService,
    ) { }
    // ===> Method to generate report
    async generate(
        // params?:{
        //     page?       : number,
        //     limit?      : number,
        //     key?        : string,
        //     type?       : number,
        //     creator?    : number,
        userId      : number,
        startDate?  : string,
        endDate?    : string,
        //     sort_by?    : string,
        //     order?      : string,
        // }
        report_type : string = 'PDF'
    ){
        if(report_type === 'PDF'){
            return await this._productPDFservice.generate(startDate, endDate, userId);
        }else{
            return await this._productExcelService.generate(startDate, endDate,userId);
        }
    }
}