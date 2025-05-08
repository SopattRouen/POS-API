// =========================================================================>> Core Library
import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

// =========================================================================>> Custom Library
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { SendFileDto, SendLocationDto, SendMessageDto } from './dto';
import { TelegramService } from './service';
// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class TelegramController {

    constructor(private readonly _service: TelegramService) { };

    // ====================================================>> Sum 1
    @Get('me')
    async getMe(): Promise<{ result: number }> {
        return await this._service.getMe();
    }

    @Post('send-message')
    async sendMessage(@Body() dto: SendMessageDto): Promise<any> {
        const { botToken, chatId, message } = dto;
        return this._service.sendMessage(botToken, chatId, message);
    }

    @Post('send-location')
    async sendLocation(@Body() sendLocationDto: SendLocationDto): Promise<any> {
        const { botToken, chatId, latitude, longitude } = sendLocationDto;

        if (!latitude || !longitude) {
            throw new BadRequestException('Latitude and Longitude must be provided.');
        }

        return this._service.sendLocation(botToken, chatId, latitude, longitude);
    }

    @Post('send-file')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads', // Directory to save uploaded files
                filename: (req, file, cb) => {
                    cb(null, file.originalname); // Use the original file name
                },
            }),
        }),
    )
    async sendFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() sendFileDto: SendFileDto,
    ): Promise<any> {
        const { botToken, chatId } = sendFileDto;

        // Check if the file was uploaded
        if (!file) {
            throw new BadRequestException('No file uploaded. Please upload a file.');
        }

        // Resolve the full file path
        const filePath = path.resolve('./uploads', file.filename);

        return this._service.sendFile(botToken, chatId, filePath, file.originalname);
    }


}
