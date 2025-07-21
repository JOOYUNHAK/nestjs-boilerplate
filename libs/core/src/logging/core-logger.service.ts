import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CoreLoggerService implements NestLoggerService {
  constructor(private readonly logger: PinoLogger) {}

  log(message: string, data: Record<string, any> = {}) {
    this.logger.info({ data }, message);
  }

  warn(errorOrMessage: Error | string, data: Record<string, any> = {}) {
    this.logger.error({ err: errorOrMessage, data });
  }

  error(errorOrMessage: Error | string, data: Record<string, any> = {}) {
    this.logger.error({ err: errorOrMessage, data });
  }

  debug(message: string, data: Record<string, any> = {}) {
    this.logger.debug({ data }, message);
  }

  setContext(context: string) {
    this.logger.setContext(context);
  }
}
