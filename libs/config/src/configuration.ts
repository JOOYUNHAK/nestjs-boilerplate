export const configuration = () => ({
  appName: process.env.APP_NAME,
  port: parseInt(process.env.PORT as string, 10),
  db: {
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    debug: process.env.DB_DEBUG,
    driverOptions: {
      connection: {
        statementTimeout: process.env.DB_DRIVER_STATEMENT_TIMEOUT,
      },
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN as string, 10),
      max: parseInt(process.env.DB_POOL_MAX as string, 10),
      idleTimeoutMillis: parseInt(
        process.env.DB_POOL_IDLE_TIMEOUT as string,
        10,
      ),
      acquireTimeoutMillis: parseInt(
        process.env.DB_POOL_ACQUIRE_TIMEOUT as string,
        10,
      ),
    },
  },
});
