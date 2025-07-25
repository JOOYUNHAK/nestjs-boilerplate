import { NumberValidator } from '@libs/common';

export class ThrottleOptions {
  @NumberValidator({ positive: true })
  ttl!: number;

  @NumberValidator({ positive: true })
  limit!: number;
}
