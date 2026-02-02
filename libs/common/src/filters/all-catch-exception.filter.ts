import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { UiMessages } from '../constants/ui-messages';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch()
export class AllCatchExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllCatchExceptionFilter.name);

  @SentryExceptionCaptured()
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let uiMessage: UiMessages;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const payload = exception.getResponse() as { uiMessage: UiMessages };
      uiMessage = payload.uiMessage ?? (exception.message as UiMessages);
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      uiMessage = UiMessages.INTERNAL_SERVER_ERROR;
    }

    if (statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.warn(exception);
    } else {
      this.logger.error(exception);
    }

    response.status(statusCode).json({
      statusCode,
      message: uiMessage,
    });
  }
}
