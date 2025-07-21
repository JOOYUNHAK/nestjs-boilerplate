import { StringValidator } from '@libs/common';

export class JwtOptions {
  @StringValidator()
  secret!: string;

  @StringValidator()
  expiresIn!: string;
}
