import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';

// Response type of File V4
interface File {
    name: string;
    uri: string;
    mimetype: string;
    size: number;
}

// Request bodies types
interface UploadBase64ImageBody {
    folder: string;
    image: string;
}

// Union type for request bodies
type RequestBody = UploadBase64ImageBody | FormData;

@Injectable()
export class FileService {
    
    private fileBaseUrl = process.env.FILE_BASE_URL;
    private fileUsername = process.env.FILE_USERNAME;
    private filePassword = process.env.FILE_PASSWORD;

    constructor(private readonly httpService: HttpService) { }

    private async sendRequest(url: string, data: RequestBody, headers: Record<string, string>) {
        const result: { file?: File, error?: string } = {};
        try {
            // Convert Observable to Promise by using firstValueFrom() method
            const response = await firstValueFrom(this.httpService.post(url, data, { headers }));
            result.file = response.data.data;
        } catch (error) {
            result.error = error?.response?.data?.message || 'Something went wrong';
        }
        return result;
    }

    private getAuthHeaders(): Record<string, string> {
        return {
            Authorization: `Basic ${Buffer.from(`${this.fileUsername}:${this.filePassword}`).toString('base64')}`
        };
    }

    public async uploadBase64Image(folder: string, base64: string) {
        const body: UploadBase64ImageBody = {
            folder: folder,
            image: base64
        };
        const headers = {
            ...this.getAuthHeaders()
        };
        return await this.sendRequest(this.fileBaseUrl + '/api/file/upload-base64', body, headers);
    }

    public async uploadSingleFile(folder: string, file: Express.Multer.File) {
        const formData = new FormData();
        formData.append('folder', folder);
        formData.append('file', file.buffer, file.originalname);
        const headers = {
            ...formData.getHeaders(),
            ...this.getAuthHeaders()
        };
        return await this.sendRequest(this.fileBaseUrl + '/api/file/upload-single', formData, headers);
    }
}
