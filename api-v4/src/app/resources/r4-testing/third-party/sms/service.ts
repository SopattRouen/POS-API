// =========================================================================>> Core Library
import { BadRequestException, Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
// ======================================= >> Code Starts Here << ========================== //
@Injectable()
export class SMSService {

    constructor() { };
    private async createTransporter(smtpUser: string, smtpPass: string) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpUser, // Gmail address
                pass: smtpPass, // Gmail password
            },
        });
    }

    async sendEmail(
        smtpUser: string,
        smtpPass: string,
        toEmail: string,
        message: string,
    ): Promise<any> {
        try {
            const transporter = await this.createTransporter(smtpUser, smtpPass);

            // Email options
            const mailOptions = {
                from: smtpUser,
                to: toEmail,
                subject: 'Test',
                text: message, // The message content
            };

            // Send the email
            const info = await transporter.sendMail(mailOptions);
            return { message: 'Email sent successfully', info };
        } catch (error) {
            throw new BadRequestException(`Error sending email: ${error.message}`);
        }
    }

    async sendFile(smtpUser: string, smtpPass: string, toEmail: string, filePath: string, originalFileName: string,): Promise<any> {
        try {
            const transporter = await this.createTransporter(smtpUser, smtpPass);

            const mailOptions = {
                from: smtpUser,
                to: toEmail,
                subject: 'File Attachment',
                text: 'File attached.',
                attachments: [
                    {
                        path: filePath,
                        filename: originalFileName,
                    },
                ],
            };

            const info = await transporter.sendMail(mailOptions);

            // Delete the file after sending
            fs.unlinkSync(filePath);

            return { message: 'File sent successfully', info };
        } catch (error) {
            throw new BadRequestException(`Error sending email: ${error.message}`);
        }
    }
}