//===> core library
import { Injectable } from "@nestjs/common";
//===> custom library
import { SalePDFReportService } from "./pdf-service";
import { SaleExcelReportService } from "./excel-service";

@Injectable()
export class SaleReportService {

    constructor(
        private readonly _salePDFservice:SalePDFReportService ,
        private readonly _saleExcelService: SaleExcelReportService
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
            return await this._salePDFservice.generate(startDate, endDate, userId);
        }else{
            return await this._saleExcelService.generate(startDate, endDate,userId);
        }
    }
}