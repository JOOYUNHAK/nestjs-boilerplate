import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAppOrmConfig } from './orm.helper';
import { User } from '../entity';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const configs = getAppOrmConfig(configService);
        return { ...configs, autoLoadEntities: true }; // for nestjs
      },
      //https://github.com/mikro-orm/nestjs/pull/204
      driver: PostgreSqlDriver,
    }),
    MikroOrmModule.forFeature([User]),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
