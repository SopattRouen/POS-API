// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Third Party Library

// ===========================================================================>> Costom Library
// Custom Components:
import { FileService } from 'src/app/services/file.service';// for uploading file

import { ProductController } from './controller';
import { ProductService } from './service';

@Module({
    controllers: [
        ProductController
    ],
    providers: [
        FileService,
        ProductService
    ]
})
export class ProductModule {}
