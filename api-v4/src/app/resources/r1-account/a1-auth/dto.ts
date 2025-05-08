
// ===========================================================================>> Core Library
import { IsNotEmpty, IsString } from 'class-validator';

// ===========================================================================>> Costom Library
import User from '@app/models/user/user.model';

export class UserDto {
    id: number;
    name: string;
    avatar: string;
    phone: string;
    email: string;
    created_at: Date;
    roles: {
        id: number;
        name: string;
        is_default: boolean;
    }[];

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.avatar = user.avatar;
        this.phone = user.phone;
        this.email = user.email;
        this.created_at = user.created_at,
            this.roles = user.roles.map(v => ({
                id: v.id,
                name: v.name,
                is_default: v['UserRoles'].is_default
            }));
    }
}


export class LoginRequestDto {

    @IsString()
    @IsNotEmpty({ message: "Filed username is required" })
    username: string;

    @IsString()
    @IsNotEmpty({ message: "Filed password is required" })
    password: string;

    @IsString()
    @IsNotEmpty({ message: "Filed platform is required Mobile or Web" })
    platform: string;
}
export class LoginRequestOTPDto {

    @IsString()
    @IsNotEmpty({ message: "Filed username is required" })
    username: string;

    @IsString()
    @IsNotEmpty({ message: "Filed opt is required" })
    otp: string;

    @IsString()
    @IsNotEmpty({ message: "Filed platform is required Mobile or Web" })
    platform: string;
}