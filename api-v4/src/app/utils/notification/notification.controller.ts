// ===========================================================================>> Core Library
import { EmailService } from '@app/services/email.service';
import { Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

// ===========================================================================>> Costom Library

@Controller()
export class NotificationController {

    constructor(private readonly _service: NotificationService,
        private readonly emailService: EmailService
    ) { };

    @Get()
    async getAllNotification() {
        return await this._service.getData();
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: number) {
        return this._service.toggleReadStatus(id);
    }

    @Delete(':id')
    async deleteNotification(@Param('id', ParseIntPipe) id: number) {
        return this._service.deleteNotification(id);
    }

    @Get('send-email')
    async sendEmail() {
        await this.emailService.sendHTMLMessage(
            'suvannet999@gmail.com',
            'Welcome!',
            '<h1>Hello, Welcome to Our Service!</h1>',
        );
        return 'Email sent!';
    }
}
