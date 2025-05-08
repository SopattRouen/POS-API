// email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: Number(process.env.SMTP_PORT) || 587,
                secure: false, // Set to true for port 465
                auth: {
                    user: process.env.SMTP_USER || 'your-email@example.com', 
                    pass: process.env.SMTP_PASS || 'your-app-password', 
                },
            });
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    private handleInitializationError(error: any) {
        this.logger.error(`Error initializing Email Service: ${error.message}`);
    }

    async sendHTMLMessage(to: string, subject: string, htmlText: string) {
        try {
            const mailOptions: nodemailer.SendMailOptions = {
                from: process.env.SMTP_USER || 'your-email@example.com',
                to,
                subject,
                html: htmlText,
            };

            await this.transporter.sendMail(mailOptions);
            this.logger.log('Email sent successfully.');
        } catch (error) {
            this.handleSendMessageError(error);
        }
    }

    async sendDocument(to: string, subject: string, fileBuffer: Buffer, fileName: string, caption?: string) {
        try {
            const mailOptions: nodemailer.SendMailOptions = {
                from: process.env.SMTP_USER || 'your-email@example.com',
                to,
                subject,
                text: caption || 'Please find the attached document.',
                attachments: [
                    {
                        filename: fileName,
                        content: fileBuffer,
                    },
                ],
            };

            await this.transporter.sendMail(mailOptions);
            this.logger.log('Document sent successfully via email.');
        } catch (error) {
            this.handleSendDocumentError(error);
        }
    }

    private handleSendMessageError(error: Error | any) {
        this.logger.error(`Error sending email: ${error.message}`);
    }

    private handleSendDocumentError(error: Error | any) {
        this.logger.error(`Error sending document via email: ${error.message}`);
    }
}
