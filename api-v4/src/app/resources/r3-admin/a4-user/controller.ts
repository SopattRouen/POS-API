// ===========================================================================>> Core Library
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";

// ===========================================================================>> Costom Library
import UserDecorator from "@app/core/decorators/user.decorator";
import User from "@app/models/user/user.model";
import { CreateUserDto, UpdatePasswordDto, UpdateStatusDto, UpdateUserDto } from "./dto";
import { Create, List, Update } from "./interface";
import { UserService } from "./service";

@Controller()
export class UserController {

    constructor(
        private userService: UserService,
    ) { };

    @Get('setup')
    async setup() {
        return await this.userService.setup();
    }

    @Get()
    async getData(@UserDecorator() auth: User,
        @Query('page_size') page_size?: number,
        @Query('page') page?: number,
        @Query('key') key?: string,
        @Query('type') type_id?: number,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string): Promise<List> {
        if (!page_size) {
            page_size = 10;
        }
        if (!page) {
            page = 1;
        }
        return await this.userService.getData(auth.id, page_size, page, key, type_id , startDate, endDate);
    }

    @Get('/:id')
    async view(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.view(id);
    }

    @Post()
    async create(@Body() body: CreateUserDto, @UserDecorator() user: User): Promise<Create> {
        return this.userService.create(body, user.id);
    }

    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @UserDecorator() user: User): Promise<Update> {
        return await this.userService.update(id, body, user.id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return await this.userService.delete(id);
    }

    @Put('status/:id')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateStatusDto): Promise<{ message: string }> {
        return await this.userService.updateStatus(id, body);
    }

    @Put('update-password/:id')
    async updatePassword(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePasswordDto): Promise<{ message: string }> {
        return await this.userService.updatePassword(id, body);
    }
}