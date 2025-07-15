import { NumberValidator, StringValidator } from '@libs/common';

export enum Environment {
  TEST = 'test',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export class ConfigurationDTO {
  @StringValidator({ enum: Environment })
  NODE_ENV: Environment;

  @StringValidator()
  appName: string;

  @NumberValidator({
    integer: true,
    min: 1,
  })
  port: number;
}
