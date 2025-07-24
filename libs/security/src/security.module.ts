import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtUserStrategy } from './jwt-user.strategy';

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
  ],
  providers: [JwtUserStrategy],
  exports: [JwtUserStrategy],
})
export class SecurityModule {}
