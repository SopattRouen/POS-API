import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
    @IsNotEmpty()
    botToken: string;

    @IsNotEmpty()
    chatId: string;

    @IsNotEmpty()
    message: string;
}

export class SendLocationDto {
    @IsString()
    @IsNotEmpty()
    botToken: string;

    @IsString()
    @IsNotEmpty()
    chatId: string;

    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}


export class SendFileDto {
    @IsString()
    @IsNotEmpty()
    botToken: string;

    @IsString()
    @IsNotEmpty()
    chatId: string;
}