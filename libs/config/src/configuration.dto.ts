import { NumberValidator, StringValidator } from '@libs/common';

export enum NodeEnv {
  TEST = 'test',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export class ConfigurationDTO {
  @StringValidator({ enum: Object.values(NodeEnv) })
  NODE_ENV: NodeEnv;

  @StringValidator()
  APP_NAME: string;

  @NumberValidator({
    integer: true,
    min: 1,
  })
  PORT: number;
}
