import { Test, TestingModule } from '@nestjs/testing';
import { SentryLoggerService } from './sentry-logger.service';
import * as Sentry from '@sentry/nestjs';

// Sentry 모듈 Mocking
jest.mock('@sentry/nestjs');

describe('SentryLoggerService', () => {
  let service: SentryLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentryLoggerService],
    }).compile();

    service = module.get<SentryLoggerService>(SentryLoggerService);
    jest.clearAllMocks(); // Mock 초기화
  });

  describe('Local Environment (Development)', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should log to console but NOT send breadcrumb to Sentry', () => {
      const spyConsole = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      service.log('Test Log', 'TestContext');

      expect(spyConsole).toHaveBeenCalled(); // 콘솔엔 찍혀야 함
      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled(); // Sentry엔 안 가야 함
    });

    it('should log error to console but NOT capture exception in Sentry', () => {
      const spyConsole = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      service.error('Test Error', 'stack', 'TestContext');

      expect(spyConsole).toHaveBeenCalled();
      expect(Sentry.captureException).not.toHaveBeenCalled();
    });
  });

  describe('Production Environment', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should send breadcrumb to Sentry for normal logs', () => {
      service.log('User Login', 'AuthService');

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User Login',
          category: 'log',
          level: 'info',
        }),
      );
    });

    it('should capture exception in Sentry for errors', () => {
      const errorMsg = new Error('Critical Failure');
      service.error(errorMsg, errorMsg.stack, 'OrderService');

      expect(Sentry.captureException).toHaveBeenCalledWith(
        errorMsg,
        expect.objectContaining({
          level: 'error',
          extra: { context: 'OrderService', stack: errorMsg.stack },
        }),
      );
    });

    it('should IGNORE logs from HealthController (Noise Filtering)', () => {
      service.log('Health Check OK', 'HealthController');

      // 운영 환경이라도 헬스 체크는 무시해야 함
      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
    });

    it('should IGNORE logs containing /health url', () => {
      service.log('GET /health 200 OK', 'HTTP');

      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
    });
  });
});
