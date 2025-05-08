//===> core library
import { BadRequestException, Injectable, RequestTimeoutException } from "@nestjs/common";
import { fn, col, Op }                                              from "sequelize";
//===> custom library
import Order                                                        from "@app/models/order/order.model";
import User                                                         from "@app/models/user/user.model";
//===> third-party library
import { JsReportService }                                          from "@app/services/js-report.service";

@Injectable()
export class CashierExcelReportService {
    //===> constructor
    constructor(
        private readonly jsReportService: JsReportService,
    ) { };

    // ===> Medthod to generate cashier report
    async generate(
        startDate   : string,
        endDate     : string,
        userId      : number
    ) {

        const { start, end } = this.getStartAndEndDateInCambodia(
            startDate || this.getCurrentDate(),
            endDate || this.getCurrentDate()
        );
        //===> fetch user
        const user = await this.fetchUser(userId);
        //===> fetch cashier sales
        const cashiers = await this.fetchCashierSales(start, end);
        //===> calculate total orders
        const totalOrders = this.calculateTotal(cashiers, 'totalOrders');
        //===> calculate total sales
        const totalSales = this.calculateTotal(cashiers, 'totalSales');
        //===> build report data
        const reportData = this.buildReportData(user, totalSales, cashiers, start, end, totalOrders);
        //===> generate and send report
        return this.generateAndSendReport(reportData, process.env.JS_TEMPLATE_CASHIER, 'Cashier Sales Report', 'របាយការណ៍លក់តាមអ្នកគិតប្រាក់');
    }

    // =============================>> Private Helper Methods

    private async fetchUser(userId: number) {
        const user = await User.findByPk(userId);
        if (!user) throw new BadRequestException('User not found.');
        return user;
    }


    private async fetchCashierSales(startDate: Date, endDate: Date) {
        return User.findAll({
            attributes: [
                'id', 'name', 'phone',
                [fn('COUNT', col('orders.id')), 'totalOrders'],
                [fn('SUM', col('orders.total_price')), 'totalSales'],
            ],
            include: [
                { model: Order, as: 'orders', attributes: [], where: { ordered_at: { [Op.between]: [startDate, endDate] } } }
            ],
            group: ['User.id'],
            raw: true,
        });
    }


    private calculateTotal(items: any[], field: string): number {
        return items.reduce((sum, item) => sum + Number(item[field] || 0), 0);
    }


    private buildReportData(user: User, totalSales: number, data: any[], startDate: Date, endDate: Date, totalQty = 0) {
        const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh', hour12: true });

        return {
            currentDate: now.split(',')[0],
            currentTime: now.split(',')[1].trim(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            name: user.name,
            SumTotalPrice: totalSales,
            SumTotalSale: totalQty,
            data
        };
    }

    private getCurrentDate(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Returns 'YYYY-MM-DD'
    }

    // Helper to calculate start and end dates for Cambodia timezone (UTC+7)
    private getStartAndEndDateInCambodia(startDate: string, endDate: string) {
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59`);

        // Adjust for UTC+7 (Cambodia time)
        start.setHours(start.getHours() - start.getTimezoneOffset() / 60 + 7);
        end.setHours(end.getHours() - end.getTimezoneOffset() / 60 + 7);

        return { start, end };
    }

    // Helper to generate and send report to jsreport
    private async generateAndSendReport(
        reportData: any,
        template: string,
        fileName: string,
        content: string,
        timeout: number = 30 * 1000
    ) {
        try {
            const result = await this.withTimeout(this.jsReportService.generateReport(template, reportData), timeout);
            if (result.error) throw new BadRequestException('Report generation failed.');
            return result;
        } catch (error) {
            if (error instanceof RequestTimeoutException) {
                throw new RequestTimeoutException('Request Timeout: Report generation took too long.');
            }
            throw new BadRequestException(error.message || 'Failed to generate and send the report.');
        }
    }

    private withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new RequestTimeoutException('Request Timeout: Operation took too long.')), timeout);
            promise.then(resolve).catch(reject).finally(() => clearTimeout(timer));
        });
    }
}