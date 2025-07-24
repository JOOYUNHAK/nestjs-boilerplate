import { Environment } from '@libs/common';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(process.cwd(), 'env', `.env.${process.env.NODE_ENV}`),
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: +(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
  profilesSampleRate: +(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? 0.1),
  environment: process.env.NODE_ENV,
  enabled:
    process.env.NODE_ENV === Environment.PRODUCTION ||
    process.env.NODE_ENV === Environment.STAGING,
});
