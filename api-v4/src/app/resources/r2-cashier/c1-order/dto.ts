// =========================================================================>> Custom Library
import Product from '@app/models/product/product.model';
import { IsJSON, IsNotEmpty } from 'class-validator';
export class CreateOrderDto {
    @IsNotEmpty()
    @IsJSON()
    cart: string
    
    @IsNotEmpty()
    platform: string
}

export interface ProductWithType extends Omit<Product, 'type'> {
    productType: string;  // Add the productType field to each product
}
