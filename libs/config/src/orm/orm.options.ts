import {
  BooleanValidator,
  NestedValidator,
  NumberValidator,
  StringValidator,
} from '@libs/common';
import { OrmDriverOptions } from './orm-driver.options';
import { OrmPoolOptions } from './orm-pool.options';

export class OrmOptions {
  @StringValidator()
  dbName: string;

  @StringValidator()
  host: string;

  @NumberValidator()
  port: number;

  @StringValidator()
  user: string;

  @StringValidator()
  password: string;

  @BooleanValidator()
  debug: boolean;

  @NestedValidator(() => OrmDriverOptions)
  driverOptions: OrmDriverOptions;

  @NestedValidator(() => OrmPoolOptions)
  pool: OrmPoolOptions;
}
