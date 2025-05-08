import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateReportDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    baseURL: string;

    @IsString()
    @IsNotEmpty()
    template: string;

    // @IsObject()
    @Optional()
    data: any;
}
