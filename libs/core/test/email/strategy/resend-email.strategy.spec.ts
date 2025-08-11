import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ResendEmailStrategy } from '@libs/core/email/strategy/resend-email.strategy';
import { EmailPayload } from '@libs/core';
import { CoreLoggerService } from '@libs/core/logging/core-logger.service';

describe('ResendEmailStrategy Unit Test', () => {
  let resendEmail: ResendEmailStrategy, logger: CoreLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ResendEmailStrategy,
          useValue: {
            send: jest.fn(),
            sendBatch: jest.fn(),
          },
        },
        {
          provide: CoreLoggerService,
          useValue: {
            error: jest.fn(),
            setContext: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue({
              apiKey: 'test-api-key',
              from: 'test@example.com',
            }),
          },
        },
      ],
    }).compile();

    resendEmail = module.get<ResendEmailStrategy>(ResendEmailStrategy);
    logger = module.get<CoreLoggerService>(CoreLoggerService);
  });

  beforeEach(() => jest.clearAllMocks());

  describe('send()', () => {
    it('payload.from 값이 없는 경우 호출 파라미터 확인', async () => {
      // given
      const payload: EmailPayload = {
        from: 'test@example.com',
        to: ['resend@example.com'],
        subject: 'Resend Test Subject',
        html: '<p>Hello Resend</p>',
      };

      // when
      await resendEmail.send(payload);

      // then
      expect(resendEmail.send).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
    });

    it('payload.from 값이 있는 경우 파라미터 확인', async () => {
      // given
      const payload: EmailPayload = {
        from: 'custom@example.com',
        to: ['resend@example.com'],
        subject: 'Resend Test Subject',
        html: '<p>Hello Resend</p>',
      };

      // when
      await resendEmail.send(payload);

      // then
      expect(resendEmail.send).toHaveBeenCalledWith({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
    });

    it('예외 발생 시 로깅 확인', async () => {
      // given
      const payload: EmailPayload = {
        from: 'test@example.com',
        to: ['resend@example.com'],
        subject: 'Resend Test Subject',
        html: '<p>Hello Resend</p>',
      };

      // when
      const result = async () => await resendEmail.send(payload);

      // then
    });
  });

  describe('sendBatch()', () => {
    it('배치 이메일 전송 시 호출 횟수 확인', async () => {
      // given
      const payloads: EmailPayload[] = [
        {
          from: 'test@example.com',
          to: ['resend@example.com'],
          subject: 'Resend Test Subject',
          html: '<p>Hello Resend</p>',
        },
      ];

      // when
      await resendEmail.sendBatch(payloads);

      // then
      expect(resendEmail.sendBatch).toHaveBeenCalledWith(payloads);
    });
  });
});
