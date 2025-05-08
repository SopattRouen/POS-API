import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from 'src/app/shared/pagination.interface';

export interface Response<T, P = Pagination> {
    status_code: HttpStatus;
    data?: T;
    message?: string;
    pagination?: P;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const httpContext = context.switchToHttp();
        const httpResponse = httpContext.getResponse();
        return next.handle().pipe(
            map((response) => {
                const statusCode = httpResponse.statusCode || HttpStatus.OK;
                if ('status_code' in response) {
                    // If status_code is already present, return the response as is
                    return response;
                }
                else {
                    return {
                        status_code: statusCode,
                        ...response
                    } as Response<T>;
                }
            }),
        );
    }
}
