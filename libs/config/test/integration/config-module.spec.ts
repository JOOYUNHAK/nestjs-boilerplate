import { configuration, configValidateFn, OrmOptions } from '@libs/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { join } from 'path';

describe('ConfigModule Integration Test', () => {
  let configService: ConfigService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          validate: configValidateFn,
          envFilePath: [join(process.cwd(), 'env', `.env.test`)],
        }),
      ],
    }).compile();

    configService = module.get(ConfigService);
  });

  it('application env value 확인', () => {
    // when
    const [appName, port, origin] = [
      configService.get('appName'),
      configService.get('port'),
      configService.get('origin'),
    ];
    // then
    expect(appName).toEqual('test_app');
    expect(port).toEqual(3000);
    expect(origin).toEqual(['localhost:3000']);
  });

  it('db env value 확인', () => {
    // when
    const options = configService.getOrThrow<OrmOptions>('db');

    // then
    expect(options).toStrictEqual({
      dbName: 'test_db',
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      driverOptions: {
        connection: {
          statementTimeout: 10000,
        },
      },
      pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 5000,
        acquireTimeoutMillis: 10000,
      },
    });
  });

  it('jwt env value 확인', () => {
    // when
    const jwt = configService.get('jwt');

    // then
    expect(jwt).toStrictEqual({
      secret: 'test_jwt_secret',
      expiresIn: '1d',
    });
  });

  it('sentry env value 확인', () => {
    // when
    const sentry = configService.get('sentry');

    // then
    expect(sentry).toBeDefined();
    expect(sentry).toHaveProperty('dsn');
    expect(sentry).toHaveProperty('tracesSampleRate');
    expect(sentry).toHaveProperty('profilesSampleRate');
  });

  it('throttle env value 확인', () => {
    // when
    const throttle = configService.get('throttle');

    // then
    expect(throttle).toStrictEqual({
      ttl: 60000, // 밀리초 단위
      limit: 10,
    });
  });

  it('resend env value 확인', () => {
    // when
    const resend = configService.get('resend');

    // then
    expect(resend).toStrictEqual({
      apiKey: 'test_resend_api_key',
      from: 'onboarding@resend.dev',
    });
  });
});
