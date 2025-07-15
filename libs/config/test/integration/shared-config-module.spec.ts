import { configValidateFn, SharedConfigModule } from '@libs/config';
import configuration from '@libs/config/configuration';
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
    const [appName, port] = [
      configService.get('appName'),
      configService.get('port'),
    ];

    // then
    expect(appName).toEqual('test_app');
    expect(port).toEqual(3000);
  });
});
