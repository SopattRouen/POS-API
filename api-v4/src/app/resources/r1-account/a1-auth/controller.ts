// ===========================================================================>> Core Library
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, UsePipes } from '@nestjs/common';

// ===========================================================================>> Costom Library
import UserDecorator from '@app/core/decorators/user.decorator';
import { RoleExistsPipe } from '@app/core/pipes/role.pipe';
import User from '@app/models/user/user.model';
import { LoginRequestDto, LoginRequestOTPDto } from './dto';
import { AuthService } from './service';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() data: LoginRequestDto, @Req() req: Request) {
        return await this.authService.login(data, req);
    }

    @Post('check-user')
    async checkExistUser(@Body('username') username: string) {
        if (!username) {
            throw new BadRequestException('Email or phone is required');
        }
        return await this.authService.checkExistUser(username);
    }

    @Post('send-otp')
    async sendOTP(@Body('username') username: string) {
        if (!username) {
            throw new BadRequestException('Email or phone is required');
        }
        return await this.authService.sendOTP(username);
    }

    @Post('verify-otp')
    async verifyOTP(@Body() body: LoginRequestOTPDto, @Req() req: Request
    ) {
        return await this.authService.verifyOTP(body, req);
    }

    @Post('switch')
    @UsePipes(RoleExistsPipe)
    async switch(@UserDecorator() auth: User, @Body() body: { role_id: number }) {
        return await this.authService.switchDefaultRole(auth, Number(body.role_id));
    }

}
