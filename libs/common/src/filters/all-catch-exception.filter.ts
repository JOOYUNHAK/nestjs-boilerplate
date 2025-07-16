import { CoreLoggerService } from '@libs/core/logging/core-logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllCatchExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CoreLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number, message: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message ?? 'Internal server error';
    }

    if (statusCode < 500) {
      this.logger.warn(exception, { message });
    } else {
      this.logger.error(exception, { message });
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
