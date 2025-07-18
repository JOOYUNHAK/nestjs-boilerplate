import { configuration, configValidateFn, OrmOptions } from '@libs/config';
import { SharedConfigModule } from '@libs/config/shared-config.module';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { join } from 'path';

describe('SharedConfigModule Integration Test', () => {
  let configService: ConfigService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        SharedConfigModule.forRoot({
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
    console.debug(origin);
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
});
