import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';

@Module({})
export class SharedConfigModule {
  static forRoot(opts: ConfigModuleOptions): DynamicModule {
    return {
      module: SharedConfigModule,
      imports: [
        ConfigModule.forRoot({
          ...opts,
          isGlobal: true,
        }),
      ],
    };
  }
}
