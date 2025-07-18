import {
  Environment,
  NestedValidator,
  NumberValidator,
  StringValidator,
} from '@libs/common';
import { OrmOptions } from './orm';

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

  @NestedValidator(() => OrmOptions)
  db: OrmOptions;
}
