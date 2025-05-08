// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Custom Library
import { FileService } from '@app/services/file.service';
import { ProfileController } from './controller';
import { ProfileService } from './service';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, FileService]
})

export class ProfileModule { }
