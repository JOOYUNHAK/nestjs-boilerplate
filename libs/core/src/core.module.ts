import { AllCatchExceptionFilter, ResponseInterceptor } from '@libs/common';
import { configuration, configValidateFn } from '@libs/config';
import { ClassSerializerInterceptor, Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { join } from 'path';
import { SharedConfigModule } from '@libs/config/shared-config.module';
import { CoreLoggerModule } from './logging/core-logger.module';
import { OrmModule } from './orm/orm.module';
import { SecurityModule } from '@libs/security/security.module';

@Global()
@Module({
  imports: [
    SharedConfigModule.forRoot({
      load: [configuration],
      validate: configValidateFn,
      envFilePath: [join(process.cwd(), 'env', `.env.${process.env.NODE_ENV}`)],
    }),
    CoreLoggerModule,
    OrmModule,
    SecurityModule,
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
  exports: [SharedConfigModule, CoreLoggerModule, SecurityModule],
})
export class CoreModule {}
