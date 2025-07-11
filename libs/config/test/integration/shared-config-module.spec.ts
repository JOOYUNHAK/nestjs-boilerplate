import { configValidateFn, SharedConfigModule } from '@libs/config';
import configuration from '@libs/config/configuration';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { join } from 'path';

describe('SharedConfigModule Integration Test', () => {
  let configService: ConfigService;

  beforeAll(async () => {
    const nodeEnv = process.env.NODE_ENV;

    const module = await Test.createTestingModule({
      imports: [
        SharedConfigModule.register({
          load: [configuration],
          validate: configValidateFn,
          envFilePath: [join(process.cwd(), 'env', `.env.${nodeEnv}`)],
        }),
      ],
    }).compile();

    configService = module.get(ConfigService);
  });

  it('', () => {
    // when
    const [appName, port] = [
      configService.get('appName'),
      configService.get('port'),
    ];

    // then
    expect(appName).toEqual('test_boilerplate');
    expect(port).toEqual(3000);
  });
});
