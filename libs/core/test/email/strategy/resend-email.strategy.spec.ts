import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ResendEmailStrategy } from '../../../src/email/strategy/resend-email.strategy';
import { EmailPayload } from '../../../src/email/email.type';

describe('ResendEmailStrategy Unit Test', () => {
  let resendEmail: ResendEmailStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ResendEmailStrategy,
          useValue: { send: jest.fn() },
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
  });

  beforeEach(() => jest.clearAllMocks());

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
});
