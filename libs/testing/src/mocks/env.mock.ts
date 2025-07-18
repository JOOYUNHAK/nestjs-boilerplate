import { Environment } from '@libs/common';

const MOCK_ENV = {
  NODE_ENV: process.env.NODE_ENV ?? Environment.TEST,
  APP_NAME: 'test_app',
  PORT: '3000',
  CORS_ORIGIN: 'localhost:3000',
  DB_NAME: 'test_db',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_DRIVER_STATEMENT_TIMEOUT: '10000',
  DB_POOL_MIN: '2',
  DB_POOL_MAX: '10',
  DB_POOL_IDLE_TIMEOUT: '5000',
  DB_POOL_ACQUIRE_TIMEOUT: '10000',
};

export const getMockEnv = () => MOCK_ENV;
