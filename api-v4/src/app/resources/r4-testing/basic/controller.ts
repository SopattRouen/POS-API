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
    sum1(){

        let a = 4;
        let b = 60;

        const c = Math.sqrt(a + b);

        return c; 

    }

    // ====================================================>> Sum 2
    @Get('sum-2')
    sum2(

        // Get request from client
        @Query('a') a?: number,
        @Query('b') b?: number
    
    ){
        const c = a + b;
        return c; 

    }

    // ====================================================>> sqrt-root
    @Get('sqrt-root')
    sqrtRoot(

        // Get request from client
        @Query('a') a?: number,
        @Query('b') b?: number,
        @Query('c') c?: number
    
    ){
        const d = a + b + c;
        return Math.sqrt(d); 

    }


    
}
