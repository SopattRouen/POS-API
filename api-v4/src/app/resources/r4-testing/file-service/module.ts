// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { BasicController } from './controller';
import { BasicService } from './service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [BasicController],
    providers: [BasicService]
})
export class BasicModule { }
