import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class JsReportService {
    private jsBaseUrl: string = process.env.JS_BASE_URL;
    private jsUsername: string = process.env.JS_USERNAME;
    private jsPassword: string = process.env.JS_PASSWORD;
    private readonly logger = new Logger(JsReportService.name);

    private getAxiosConfig<T>(templateName: string, data: T): AxiosRequestConfig {
        return {
            url: `${this.jsBaseUrl}/api/report`,
            method: 'post',
            responseType: 'arraybuffer',
            auth: {
                username: this.jsUsername,
                password: this.jsPassword,
            },
            data: {
                template: {
                    name: templateName
                },
                data: data
            }
        };
    }

    async generateReport<T>(template: string, data: T): Promise<{ data?: string, error?: string }> {
        const result: { data?: string, error?: string } = {};
        try {
            const response: AxiosResponse<Buffer> = await axios(this.getAxiosConfig(template, data));
            result.data = response.data.toString('base64');
        } catch (error) {
            this.logger.error(`Failed to generate the report: ${error.message}`);
            result.error = 'Something when wrong. Failed to generate the report';
        }
        return result;
    }
}
