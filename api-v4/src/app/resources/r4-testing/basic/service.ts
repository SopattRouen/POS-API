// =========================================================================>> Core Library
import { Injectable } from '@nestjs/common';


// ======================================= >> Code Starts Here << ========================== //
@Injectable()
export class BasicService {

    constructor() { };

    async sum1(){

        // Variable Declaration
        let a = 10;
        let b = 6;

        const c = a + b;

        // const d = Math.sqrt(c); 

        return { result: c };
    }

    async sum2( a: number = 0, b: number = 0 ): Promise<{ result: number }> {

        const c = a + b;

        //const d = Math.sqrt(Math.pow(a, b)); 
        const d = Math.exp(c); 

        return { result: d };
    }

}
