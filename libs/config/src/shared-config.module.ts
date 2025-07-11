import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';

@Global()
@Module({})
export class SharedConfigModule {
  static register(opts: ConfigModuleOptions): DynamicModule {
    return {
      module: SharedConfigModule,
      imports: [
        ConfigModule.forRoot({
          ...opts,
          isGlobal: true,
        }),
      ],
      exports: [ConfigModule],
    };
  }
}
