import { CoreLoggerService } from '@libs/core/logging/core-logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UiMessages } from '../constants/ui-messages';

@Catch()
export class AllCatchExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CoreLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let uiMessage: UiMessages;
    let systemMessage = 'Unknown Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const payload = exception.getResponse() as {
        uiMessage: UiMessages;
        systemMessage: string;
      };
      uiMessage = payload.uiMessage ?? (exception.message as UiMessages);
      systemMessage = payload.systemMessage ?? payload.uiMessage;
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
