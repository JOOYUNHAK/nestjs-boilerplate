import { Module } from '@nestjs/common';
import { SentryLoggerService } from './sentry-logger.service';

@Module({
  providers: [SentryLoggerService],
  exports: [SentryLoggerService],
})
export class SentryLoggerModule {}
