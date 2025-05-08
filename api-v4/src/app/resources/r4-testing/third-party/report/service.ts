// =========================================================================>> Core Library
import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


// ======================================= >> Code Starts Here << ========================== //
@Injectable()
export class ReportService {

    constructor() { };

    async getMe(): Promise<{ result: number }> {

        // Variable Declaration
        let a = 10;
        let b = 6;

        const c = a + b;

        const d = Math.sqrt(c);

        return { result: d };
    }


    async generateReport<T>(username: string, password: string, baseURL: string, template: string, data: T): Promise<{ data?: string, error?: string }> {
        const result: { data?: string, error?: string } = {};
        try {
            const config = this.getAxiosConfig(username, password, baseURL, template, data);
            const response: AxiosResponse<Buffer> = await axios(config);

            // Convert the binary response to base64 string and return
            result.data = response.data.toString('base64');
        } catch (error) {
            // Handle errors and log them
            console.error(`Failed to generate the report: ${error.message}`);
            result.error = 'Something went wrong. Failed to generate the report';
        }
        return result;
    }

    private getAxiosConfig<T>(username: string, password: string, baseURL: string, template: string, data: T): AxiosRequestConfig {
        return {
            url: `${baseURL}/api/report`,
            method: 'post',
            responseType: 'arraybuffer',
            auth: {
                username: username,
                password: password,
            },
            data: {
                template: {
                    name: template,
                },
                data: data,
            },
        };
    }

}