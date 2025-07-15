import { AllCatchExceptionFilter, ResponseInterceptor } from '@libs/common';
import { configValidateFn, SharedConfigModule } from '@libs/config';
import configuration from '@libs/config/configuration';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { join } from 'path';

@Module({
  imports: [
    SharedConfigModule.forRoot({
      load: [configuration],
      validate: configValidateFn,
      envFilePath: [join(process.cwd(), 'env', `.env.${process.env.NODE_ENV}`)],
    }),
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
})
export class CoreModule {}
