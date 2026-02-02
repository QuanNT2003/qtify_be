import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: ApiResponse<null> = {
      status: 'error',
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'An error occurred',
      error:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).error || exception.name
          : exception.name,
    };

    response.status(status).json(errorResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ApiResponse<null> = {
      status: 'error',
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      error: exception instanceof Error ? exception.name : 'UnknownError',
    };

    response.status(status).json(errorResponse);
  }
}
