// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { EmailService } from '@app/services/email.service';
import { AuthController } from './controller';
import { AuthService } from './service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, EmailService]
})

export class AuthModule { }
