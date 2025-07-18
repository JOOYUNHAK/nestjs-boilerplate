import { mapEnvToConfig } from '@libs/config';
import { getMockEnv } from '@libs/testing';

describe('mapEnvToConfig Unit Test', () => {
  it('평탄화 되어있는 env 파일내의 값들 ConfiguartionDTO 구조에 맞게 변환 확인', () => {
    // given
    const env = getMockEnv();

    // when
    const result = mapEnvToConfig(env);

    // then
    expect(result).toStrictEqual({
      NODE_ENV: env.NODE_ENV,
      appName: env.APP_NAME,
      port: +env.PORT,
      origin: env.CORS_ORIGIN.split(','),
      db: {
        dbName: env.DB_NAME,
        host: env.DB_HOST,
        port: +env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        driverOptions: {
          connection: {
            statementTimeout: +env.DB_DRIVER_STATEMENT_TIMEOUT,
          },
        },
        pool: {
          min: +env.DB_POOL_MIN,
          max: +env.DB_POOL_MAX,
          idleTimeoutMillis: +env.DB_POOL_IDLE_TIMEOUT,
          acquireTimeoutMillis: +env.DB_POOL_ACQUIRE_TIMEOUT,
        },
      },
    });
  });
});
