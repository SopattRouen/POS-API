// =========================================================================>> Core Library
import { Body, Controller, Get, Post } from '@nestjs/common';

// =========================================================================>> Custom Library
import UserDecorator from '@app/core/decorators/user.decorator';
import User from '@app/models/user/user.model';
import Order from '@app/models/order/order.model';
import Product from '@app/models/product/product.model';
import { CreateOrderDto } from './dto';
import { OrderService } from './service';

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class OrderController {

    constructor(private readonly _service: OrderService) { };

    @Get('products')
    async getProducts(): Promise<{ data: { id: number, name: string, products: Product[] }[] }> {
        return await this._service.getProducts();
    }

    @Post('order')
    async makeOrder(@Body() body: CreateOrderDto, @UserDecorator() user: User): Promise<{ data: Order, message: string }> {
        return await this._service.makeOrder(user.id, body);
    }
    
}
