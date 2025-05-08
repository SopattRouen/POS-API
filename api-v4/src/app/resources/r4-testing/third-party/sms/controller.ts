// =========================================================================>> Core Library
import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

// =========================================================================>> Custom Library
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { SendEmailDto, SendFileDto } from './dto';
import { SMSService } from './service';
// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class SMSController {

    constructor(private readonly _service: SMSService) { };

    // ====================================================>> Send Message

    @Post('send-message')
    async sendMessage(@Body() sendEmailDto: SendEmailDto): Promise<any> {
        const { smtpUser, smtpPass, toEmail, message } = sendEmailDto;
        return this._service.sendEmail(smtpUser, smtpPass, toEmail, message);
    }

    @Post('send-file')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads', // Directory to save uploaded files
                filename: (req, file, cb) => {
                    // Use original file name for the uploaded file
                    cb(null, file.originalname);
                },
            }),
        }),
    )
    async sendFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() sendFileDto: SendFileDto,
    ): Promise<any> {
        const { smtpUser, smtpPass, toEmail } = sendFileDto;

        if (!file) {
            throw new BadRequestException('No file uploaded. Please upload a file.');
        }

        const filePath = path.resolve('./uploads', file.filename);
        return this._service.sendFile(smtpUser, smtpPass, toEmail, filePath, file.originalname); // Pass original name
    }


}
