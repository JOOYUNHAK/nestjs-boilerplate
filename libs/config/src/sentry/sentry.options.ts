import { NumberValidator, StringValidator } from '@libs/common';

export class SentryOptions {
  @StringValidator()
  dsn!: string;

  @NumberValidator()
  tracesSampleRate!: number;

  @NumberValidator()
  profilesSampleRate!: number;
}
