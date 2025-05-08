
//===>core library
import { Injectable } from "@nestjs/common";
//===>custom library
import { CashierPDFReportService } from "./pdf-service";
import { CashierExcelReportService } from "./excel-service";

@Injectable()
export class CashierReportService {


    constructor(
        private readonly _cashierPDFservice: CashierPDFReportService,
        private readonly _cashierExcelService: CashierExcelReportService
    ) { };

    // Method to generate the report based on the report type (PDF or Excel) 
    async generate(
        // params?:{
        //     page?       : number,
        //     limit?      : number,
        //     key?        : string,
        //     type?       : number,
        //     creator?    : number,
        userId: number,
        startDate?  : string,
        endDate?    : string,
        //     sort_by?    : string,
        //     order?      : string,
        // }
        report_type: string = 'PDF'
    ){
        if(report_type === 'PDF'){
            // Generate the report in PDF format
            return await this._cashierPDFservice.generate(startDate, endDate, userId);

        }else{
            // Generate the report in Excel format
            return await this._cashierExcelService.generate(startDate, endDate,userId);
            
        }
    }
}