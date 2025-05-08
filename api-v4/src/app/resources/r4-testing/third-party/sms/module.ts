// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { SMSController } from './controller';
import { SMSService } from './service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [SMSController],
    providers: [SMSService]
})
export class SMSModule { }
