import { AllCatchExceptionFilter, ResponseInterceptor } from '@libs/common';
import { configValidateFn, SharedConfigModule } from '@libs/config';
import configuration from '@libs/config/configuration';
import { ClassSerializerInterceptor, Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { join } from 'path';
import { CoreLoggerModule } from './logging';

@Global()
@Module({
  imports: [
    SharedConfigModule.forRoot({
      load: [configuration],
      validate: configValidateFn,
      envFilePath: [join(process.cwd(), 'env', `.env.${process.env.NODE_ENV}`)],
    }),
    CoreLoggerModule,
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
        }),
      inject: [Reflector],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [SharedConfigModule, CoreLoggerModule],
})
export class CoreModule {}
