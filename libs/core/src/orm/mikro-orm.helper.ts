import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import {
  defineConfig,
  PostgreSqlDriver,
  UnderscoreNamingStrategy,
} from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as CoreEntities from '@libs/core/entity';
import { OrmOptions } from '@libs/config';
import { Environment } from '@libs/common';
import { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';

export const getRootAsyncOptions = (): MikroOrmModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const configs = getAppOrmConfig(configService);
    return { ...configs, autoLoadEntities: true };
  },
  driver: PostgreSqlDriver,
});

const getAppOrmConfig = (config: ConfigService) => {
  const { dbName, host, port, user, password, driverOptions, pool } =
    config.getOrThrow<OrmOptions>('db');

  return defineConfig({
    // 1대1 관계에서 외래키 주인 자동 조인 여부
    autoJoinOneToOneOwner: false,
    autoJoinRefsForFilters: false,
    validate: true,
    strict: false,
    validateRequired: true,
    forceUtcTimezone: false,
    forceUndefined: false,
    ignoreUndefinedInQuery: true,
    namingStrategy: UnderscoreNamingStrategy,
    dbName,
    host,
    port,
    user,
    password,
    debug: process.env.NODE_ENV === Environment.PRODUCTION ? false : true,
    driverOptions: {
      connection: {
        statement_timeout: driverOptions.connection.statementTimeout,
      },
    },
    pool: {
      min: pool.min,
      max: pool.max,
      idleTimeoutMillis: pool.idleTimeoutMillis,
      acquireTimeoutMillis: pool.acquireTimeoutMillis,
    },
  });
};

export const getCliOrmConfig = () =>
  defineConfig({
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    forceUtcTimezone: false,
    namingStrategy: UnderscoreNamingStrategy,
    debug: true,
    entities: Object.values(CoreEntities),
    entitiesTs: undefined,
    migrations: {
      tableName: 'mikro_orm_migrations',
      pathTs: join(process.cwd(), 'migrations'),
      snapshot: true,
      emit: 'ts',
      transactional: true,
      glob: '!(*.d).{ts}',
      generator: TSMigrationGenerator,
    },
    extensions: [Migrator],
  });
