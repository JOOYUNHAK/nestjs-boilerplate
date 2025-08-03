import { StringValidator } from '@libs/common';

export class ResendOptions {
  @StringValidator()
  apiKey: string;

  @StringValidator()
  from: string;
}
