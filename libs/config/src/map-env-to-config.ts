import { ConfigurationDTO } from './configuration.dto';

/**
 *
 * env 파일들의 평탄화된 값들을 DTO에 맞게 변환시켜준다.
 */
export function mapEnvToConfig(env: Record<string, any>): ConfigurationDTO {
  return {
    NODE_ENV: env.NODE_ENV,
    appName: env.APP_NAME,
    port: +env.PORT,
    origin: env.CORS_ORIGIN?.split(','),
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
    },
    sentry: {
      dsn: env.SENTRY_DSN,
      profilesSampleRate: +env.SENTRY_PROFILES_SAMPLE_RATE,
      tracesSampleRate: +env.SENTRY_TRACES_SAMPLE_RATE,
    },
    throttle: {
      ttl: +env.THROTTLE_TTL, // 밀리초 단위
      limit: +env.THROTTLE_LIMIT,
    },
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
    resend: {
      apiKey: env.RESEND_API_KEY,
      from: env.RESEND_FROM_EMAIL,
    },
  };
}
