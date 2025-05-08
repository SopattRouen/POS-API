// =========================================================================>> Core Library
import { Body, Controller, Get, Query } from '@nestjs/common';

// =========================================================================>> Custom Library
import { BasicService } from './service';

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class BasicController {

    constructor(private readonly _service: BasicService) { };

    // ====================================================>> Sum 1
    @Get('sum-1')
    async sum1(): Promise<{ result: number  }> {

        return await this._service.sum1();

    }

    // ====================================================>> Sum 2
    @Get('sum-2')
    async sum2(

        @Query('a') a?: number,
        @Query('b') b?: number
    
    ): Promise<{ result: number  }> {

        return await this._service.sum2(a, b);

    }


    
}
