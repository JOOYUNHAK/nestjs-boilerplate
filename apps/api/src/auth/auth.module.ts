import { Module } from '@nestjs/common';
import { createUseClassProvider } from '@libs/common';
import { USER_REPOSITORY, UserRepository } from '@libs/core/repository/user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    createUseClassProvider(USER_REPOSITORY, UserRepository),
  ],
})
export class AuthModule {}
