import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtUserStrategy } from './jwt-user.strategy';
import { NaverStrategy } from './naver.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('jwt.expiresIn'),
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.getOrThrow<number>('throttle.ttl'),
            limit: config.getOrThrow<number>('throttle.limit'),
          },
        ],
      }),
    }),
  ],
  providers: [JwtUserStrategy, NaverStrategy],
  exports: [JwtUserStrategy, NaverStrategy],
})
export class SecurityModule {}
