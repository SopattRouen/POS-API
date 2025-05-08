// ===========================================================================>> Core Library
import { Body, Controller, Get, Put, Query } from '@nestjs/common';

// ===========================================================================>> Costom Library
import UserDecorator from '@app/core/decorators/user.decorator';
import User from '@app/models/user/user.model';
import { UpdatePasswordDto, UpdateUserDto } from './dto';
import { ProfileService } from './service';
@Controller()
export class ProfileController {

    constructor(private profileService: ProfileService) { }


    @Put('/update')
    async updateProfile(@UserDecorator() auth: User, @Body() body: UpdateUserDto) {
        return await this.profileService.update(auth.id, body)
    }

    @Put('/update-password')
    async updatePassword(@UserDecorator() auth: User, @Body() body: UpdatePasswordDto): Promise<{ message: string }> {
        return await this.profileService.updatePassword(auth.id, body);
    }

    @Get('logs')
    async getAllSale(
        @UserDecorator() auth: User,
        @Query('page_size') page_size?: number,
        @Query('page') page?: number,
    ) {
        if (!page_size) {
            page_size = 10;
        }
        if (!page) {
            page = 1;
        }

        return await this.profileService.listingLogs(auth.id, page_size, page);
    }

}

