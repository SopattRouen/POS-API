// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { TelegramController } from './controller';
import { TelegramService } from './service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [TelegramController],
    providers: [TelegramService]
})
export class TelegramModule { }
