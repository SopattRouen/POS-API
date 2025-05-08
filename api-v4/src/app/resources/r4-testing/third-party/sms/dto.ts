import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class SendEmailDto {
    @IsString()
    @IsNotEmpty()
    smtpUser: string; // Gmail user

    @IsString()
    @IsNotEmpty()
    smtpPass: string; // Gmail password

    @IsEmail()
    @IsNotEmpty()
    toEmail: string; // Recipient email

    @IsString()
    @IsNotEmpty()
    message: string; // Message to send
}

export class SendLocationDto {
    @IsString()
    @IsNotEmpty()
    smtpUser: string; // Gmail user

    @IsString()
    @IsNotEmpty()
    smtpPass: string; // Gmail password

    @IsEmail()
    @IsNotEmpty()
    toEmail: string; // Recipient email

    @IsNumber()
    @IsNotEmpty()
    latitude: number; // Latitude

    @IsNumber()
    @IsNotEmpty()
    longitude: number; // Longitude
}

export class SendFileDto {
    @IsString()
    @IsNotEmpty()
    smtpUser: string; // Gmail user

    @IsString()
    @IsNotEmpty()
    smtpPass: string; // Gmail password

    @IsEmail()
    @IsNotEmpty()
    toEmail: string; // Recipient email
}