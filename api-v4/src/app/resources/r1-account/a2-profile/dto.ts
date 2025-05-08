import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @Matches(/^(\+855|0)[1-9]\d{7,8}$/, {
        message: 'Phone must be valit Cambodia phone number'
    })
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsOptional()
    @IsString()
    avatar: string
}

export class UpdatePasswordDto {

    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    password: string

    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    confirm_password: string
}