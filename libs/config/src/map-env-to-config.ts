import { ConfigurationDTO } from './configuration.dto';

/**
 *
 * env 파일들의 평탄화된 값들을 DTO에 맞게 변환시켜준다.
 */
export function mapEnvToConfig(env: Record<string, any>): ConfigurationDTO {
  return {
    NODE_ENV: env.NODE_ENV,
    appName: env.APP_NAME,
    port: parseInt(env.PORT, 10),
    db: {
      dbName: env.DB_NAME,
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT, 10),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      debug: env.DB_DEBUG,
      driverOptions: {
        connection: {
          statementTimeout: env.DB_DRIVER_STATEMENT_TIMEOUT,
        },
      },
      pool: {
        min: parseInt(env.DB_POOL_MIN, 10),
        max: parseInt(env.DB_POOL_MAX, 10),
        idleTimeoutMillis: parseInt(env.DB_POOL_IDLE_TIMEOUT, 10),
        acquireTimeoutMillis: parseInt(env.DB_POOL_ACQUIRE_TIMEOUT, 10),
      },
    },
  };
}
