import { AppException, UiMessages } from '@libs/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtUserPayload {
  sub: number;
}

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwt.secret'),
    });
  }

  validate({ sub }: JwtUserPayload) {
    if (!sub) {
      throw new AppException(
        UiMessages.UNAUTHORIZED,
        'Not found sub',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return { userId: sub };
  }
}
