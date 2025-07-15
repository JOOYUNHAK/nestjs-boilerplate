import {
  Injectable,
  LoggerService as NestLoggerService,
  Scope,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class CoreLoggerService implements NestLoggerService {
  constructor(private readonly logger: PinoLogger) {}

  log(message: string, data: Record<string, any> = {}) {
    this.logger.info(data, message);
  }

  warn(errorOrMessage: Error | string, data: Record<string, any> = {}) {
    if (errorOrMessage instanceof Error) {
      this.logger.warn(
        { error: errorOrMessage.stack ?? errorOrMessage.message, ...data },
        errorOrMessage.message,
      );
    } else {
      this.logger.warn(data, errorOrMessage);
    }
  }

  error(errorOrMessage: Error | string, data: Record<string, any> = {}) {
    if (errorOrMessage instanceof Error) {
      this.logger.error(
        { error: errorOrMessage.stack ?? errorOrMessage.message, ...data },
        errorOrMessage.message,
      );
    } else {
      this.logger.error(data, errorOrMessage);
    }
  }

  debug(message: string, data: Record<string, any> = {}) {
    this.logger.debug(data, message);
  }

  setContext(context: string) {
    this.logger.setContext(context);
  }
}
