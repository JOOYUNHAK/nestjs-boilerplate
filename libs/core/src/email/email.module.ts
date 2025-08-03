import { Global, Module } from '@nestjs/common';
import { ResendEmailStrategy } from './strategy/resend-email.strategy';
import { createUseClassProvider } from '@libs/common';

export const EMAIL_CLIENT = Symbol('EMAIL_CLIENT');

@Global()
@Module({
  providers: [createUseClassProvider(EMAIL_CLIENT, ResendEmailStrategy)],
  exports: [EMAIL_CLIENT],
})
export class EmailModule {}
