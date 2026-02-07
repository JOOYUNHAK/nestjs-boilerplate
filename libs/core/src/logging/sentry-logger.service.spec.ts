import { Test, TestingModule } from '@nestjs/testing';
import { SentryLoggerService } from './sentry-logger.service';
import { ConsoleLogger } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';

// Sentry 모듈 Mocking
jest.mock('@sentry/nestjs');

describe('SentryLoggerService', () => {
  let service: SentryLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentryLoggerService],
    }).compile();

    service = await module.resolve<SentryLoggerService>(SentryLoggerService);
    // ConsoleLogger 출력 억제
    jest.spyOn(ConsoleLogger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(ConsoleLogger.prototype, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  describe('Local Environment (Development)', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should NOT send to Sentry in development', () => {
      service.log('Test Log', 'TestContext');

      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
    });

    it('should NOT send error to Sentry in development', () => {
      service.error('Test Error', 'stack', 'TestContext');

      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
    });
  });

  describe('Production Environment', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should send error breadcrumb to Sentry for errors', () => {
      service.error('Critical Failure', 'stack trace', 'OrderService');

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'error',
          message: 'Critical Failure',
          level: 'error',
        }),
      );
    });

    it('should IGNORE logs from HealthController (Noise Filtering)', () => {
      service.log('Health Check OK', 'HealthController');

      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
    });

    it('should IGNORE logs containing /health url', () => {
      service.log('GET /health 200 OK', 'HTTP');

      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
    });
  });
});
