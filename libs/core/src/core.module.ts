import { AllCatchExceptionFilter, ResponseInterceptor } from '@libs/common';
import { configuration, configValidateFn } from '@libs/config';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  Reflector,
} from '@nestjs/core';
import { join } from 'path';
import { SentryLoggerModule } from './logging/sentry-logger.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SecurityModule } from '@libs/security/security.module';
import { JwtUserGuard } from '@libs/security';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { getRootAsyncOptions } from './orm';
import { EmailModule } from './email/email.module';
import { PoolMonitorModule } from './orm/pool-monitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: configValidateFn,
      envFilePath: [join(process.cwd(), 'env', `.env.${process.env.NODE_ENV}`)],
    }),
    MikroOrmModule.forRootAsync(getRootAsyncOptions()),
    SentryLoggerModule,
    SecurityModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    EmailModule,
    PoolMonitorModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtUserGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllCatchExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector, {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
          exposeUnsetFields: false, // undefined 제거
        }),
      inject: [Reflector],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class CoreModule {}
