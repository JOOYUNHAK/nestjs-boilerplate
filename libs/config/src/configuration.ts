export const configuration = () => ({
  appName: process.env.APP_NAME,
  port: +(process.env.PORT as string),
  origin: process.env.CORS_ORIGIN?.split(','),
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
});
