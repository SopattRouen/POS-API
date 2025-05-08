// ===========================================================================>> Custom Library
import { IsBase64Image } from '@app/core/decorators/base64-image.decorator'
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    code: string

    @IsNumber()
    @IsPositive()
    type_id: number

    @IsNumber()
    @IsPositive()
    unit_price: number

    @IsString()
    @IsNotEmpty()
    @IsBase64Image({ message: 'Invalid image format. Image must be base64 encoded JPEG or PNG.' })
    image: string
}

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    code: string

    @IsNumber()
    @IsPositive()
    type_id: number

    @IsNumber()
    @IsPositive()
    unit_price: number

    @IsOptional()
    @IsString()
    @IsBase64Image({ message: 'Invalid image format. Image must be base64 encoded JPEG or PNG.' })
    image: string
}