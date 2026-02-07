import {
  ArrayValidator,
  Environment,
  NestedValidator,
  NumberValidator,
  StringValidator,
} from '@libs/common';
import { OrmOptions } from './orm';
import { JwtOptions } from './jwt/jwt-options';
import { SentryOptions } from './sentry/sentry.options';
import { ThrottleOptions } from './throttle/throttle.options';
import { ResendOptions } from './resend/resend.options';
import { NaverOAuthOptions } from './naver/naver-oauth.options';

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

  @ArrayValidator(
    { minItems: 1 },
    { decorator: StringValidator, options: { trim: true } },
  )
  origin: string[];

  @NestedValidator({ type: () => JwtOptions })
  jwt: JwtOptions;

  @NestedValidator({ type: () => SentryOptions })
  sentry: SentryOptions;

  @NestedValidator({ type: () => ThrottleOptions })
  throttle: ThrottleOptions;

  @NestedValidator({ type: () => OrmOptions })
  db: OrmOptions;

  @NestedValidator({ type: () => ResendOptions })
  resend: ResendOptions;

  @NestedValidator({ type: () => NaverOAuthOptions })
  naver: NaverOAuthOptions;
}
