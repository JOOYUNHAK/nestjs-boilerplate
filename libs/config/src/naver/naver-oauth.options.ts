import { StringValidator } from '@libs/common';

export class NaverOAuthOptions {
  @StringValidator()
  clientId!: string;

  @StringValidator()
  clientSecret!: string;

  @StringValidator()
  callbackUrl!: string;
}
