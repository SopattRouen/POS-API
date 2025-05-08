// =========================================================================>> Core Library
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

import * as FormData from 'form-data';
import * as fs from 'fs';
// ======================================= >> Code Starts Here << ========================== //
@Injectable()
export class TelegramService {

    constructor() { };

    async getMe(): Promise<{ result: number }> {

        // Variable Declaration
        let a = 10;
        let b = 6;

        const c = a + b;

        const d = Math.sqrt(c);

        return { result: d };
    }

    async sendMessage(botToken: string, chatId: string, message: string): Promise<any> {
        try {
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const response = await axios.post(url, {
                chat_id: chatId,
                text: message,
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 401) {
                    throw new UnauthorizedException('Invalid bot token. Please check your bot token.');
                }

                if (status === 400 && data.description.includes('chat_id')) {
                    throw new BadRequestException('Invalid chat ID. Please verify the chat ID.');
                }

                throw new BadRequestException(`Telegram API error: ${data.description}`);
            }

            throw new Error('Unexpected error occurred while sending a message to Telegram.');
        }
    }

    async sendLocation(
        botToken: string,
        chatId: string,
        latitude: number,
        longitude: number,
    ): Promise<any> {
        try {
            const url = `https://api.telegram.org/bot${botToken}/sendLocation`;

            const response = await axios.post(url, {
                chat_id: chatId,
                latitude,
                longitude,
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    throw new BadRequestException('Invalid bot token. Please check your bot token.');
                }
                if (status === 400 && data.description.includes('chat_id')) {
                    throw new BadRequestException('Invalid chat ID. Please verify the chat ID.');
                }
                throw new BadRequestException(`Telegram API error: ${data.description}`);
            }
            throw new Error('Unexpected error occurred while sending location.');
        }
    }

    async sendFile(botToken: string, chatId: string, filePath: string, originalFileName: string): Promise<any> {
        try {
            const url = `https://api.telegram.org/bot${botToken}/sendDocument`;

            // Create a readable stream from the file
            const fileStream = fs.createReadStream(filePath);

            // Create form data for the file upload
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('document', fileStream, originalFileName);

            // Send the file using Telegram API
            const response = await axios.post(url, formData, {
                headers: formData.getHeaders(), // Attach correct headers for multipart
            });
            // Delete the file after sending //TODO: file service 
            fs.unlinkSync(filePath);
            return response.data;
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 401) {
                    throw new UnauthorizedException('Invalid bot token. Please check your bot token.');
                }

                if (status === 400 && data.description.includes('chat_id')) {
                    throw new BadRequestException('Invalid chat ID. Please verify the chat ID.');
                }

                throw new BadRequestException(`Telegram API error: ${data.description}`);
            }

            throw new Error('Unexpected error occurred while sending a file to Telegram.');
        }
    }

}
