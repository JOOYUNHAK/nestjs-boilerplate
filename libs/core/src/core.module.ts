import { AllCatchExceptionFilter, ResponseInterceptor } from '@libs/common';
import { configuration, configValidateFn } from '@libs/config';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { join } from 'path';
import { CoreLoggerModule } from './logging/core-logger.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { SecurityModule } from '@libs/security/security.module';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { getRootAsyncOptions } from './orm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: configValidateFn,
      envFilePath: [join(process.cwd(), 'env', `.env.${process.env.NODE_ENV}`)],
    }),
    MikroOrmModule.forRootAsync(getRootAsyncOptions()),
    CoreLoggerModule,
    SecurityModule,
    SentryModule.forRoot(),
  ],
  providers: [
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
