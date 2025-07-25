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
          statementTimeout: 30000,
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
    // sentry는 main.ts에서 configModule이 로드되기 전 구성되므로
    // key값들을 등록하지 않고 validation을 통과하는지만 확인됩니다.
    expect(sentry).toBeUndefined();
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
});
