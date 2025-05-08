import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express'; // Ensure correct typing

@Catch()
export class ExceptionErrorsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception?.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // Handle types of exceptions
        const errorMessage = exception instanceof HttpException ? exception?.getResponse() : 'Internal server error';
        let errorInfo = typeof errorMessage === 'string' ? errorMessage : (errorMessage as any).message || 'Unexpected error occurred';
        let errors = undefined;
        // it errorInfo is array it should comming from dto of class-validator
        if (Array.isArray(errorInfo)) {
            errors = errorInfo.map(value => ({
                type: 'field',
                message: value
            }));
            errorInfo = 'Invalid Entity';
        }

        const responseBody = {
            status_code: status,
            message: errorInfo,
            error: exception instanceof HttpException && typeof errorMessage !== 'string' ? (errorMessage as any).error || exception.name : 'Internal Server Error',
            ...{ errors },
            timestamp: formatDate(new Date()),
            path: request.url,
        };

        response.status(status).json(responseBody);
    }
}

function formatDate(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const amPm = date.getHours() >= 12 ? 'PM' : 'AM';
    // use format DD-MM-YYYY H:i:s
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${amPm}`;
}

