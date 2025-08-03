export const configuration = () => ({
  appName: process.env.APP_NAME,
  port: +(process.env.PORT as string),
  origin: process.env.CORS_ORIGIN?.split(','),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  throttle: {
    ttl: +(process.env.THROTTLE_TTL as string), // 밀리초 단위
    limit: +(process.env.THROTTLE_LIMIT as string),
  },
  db: {
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT as string),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    driverOptions: {
      connection: {
        statementTimeout: +(process.env.DB_DRIVER_STATEMENT_TIMEOUT as string),
      },
    },
    pool: {
      min: +(process.env.DB_POOL_MIN as string),
      max: +(process.env.DB_POOL_MAX as string),
      idleTimeoutMillis: +(process.env.DB_POOL_IDLE_TIMEOUT as string),
      acquireTimeoutMillis: +(process.env.DB_POOL_ACQUIRE_TIMEOUT as string),
    },
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM_EMAIL,
  },
});
