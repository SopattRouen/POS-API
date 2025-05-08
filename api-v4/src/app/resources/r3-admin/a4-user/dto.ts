// ===========================================================================>> Costom Library
import { IsBase64Image } from '@app/core/decorators/base64-image.decorator'
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator'
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsArray()
    role_ids: number[]

    @Matches(/^(\+855|0)[1-9]\d{7,8}$/, {
        message: 'Phone must be valit Cambodia phone number'
    })
    phone: string

    @IsString()
    email: string

    @MinLength(6)
    @IsString()
    password: string

    @IsString()
    @IsNotEmpty()
    @IsBase64Image({ message: 'Invalid image format. Image must be base64 encoded JPEG or PNG.' })
    avatar: string
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsArray()
    role_ids: number[]

    @Matches(/^(\+855|0)[1-9]\d{7,8}$/, {
        message: 'Phone must be valit Cambodia phone number'
    })
    phone: string

    @IsString()
    email: string

    @IsOptional()
    @IsString()
    avatar: string
}

export class UpdatePasswordDto {

    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    confirm_password: string
}

export class UpdateStatusDto {
    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;
}