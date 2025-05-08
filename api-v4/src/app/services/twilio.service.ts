import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
    private readonly twilioClient         : Twilio;
    private readonly twilioPhoneNumber    : string;
    private readonly TWILIO_AUTH_TOKEN    = process.env.TWILIO_AUTH_TOKEN     || "";
    private readonly TWILIO_ACCOUNT_SID   = process.env.TWILIO_ACCOUNT_SID    || "";
    private readonly TWILIO_PHONE_NUMBER  = process.env.TWILIO_PHONE_NUMBER   || "";

    constructor() {
        this.twilioClient       = new Twilio(this.TWILIO_ACCOUNT_SID, this.TWILIO_AUTH_TOKEN);
        this.twilioPhoneNumber  = this.TWILIO_PHONE_NUMBER;
    }

    async sendSMS(phoneNumber: string, message: string): Promise<any> {
        try {
            const smsResponse = await this.twilioClient.messages.create({
                from: '+19143686447',
                to: phoneNumber,
                body: message,
            });
            return smsResponse;
        } catch (error) {
            throw {
                statusCode: 400,
                message: 'Error sending SMS',
                error,
            };
        }
    }
}
