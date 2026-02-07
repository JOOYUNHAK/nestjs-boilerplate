import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

export interface NaverProfile {
  id: string;
  email: string;
  nickname: string;
}

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('naver.clientId'),
      clientSecret: configService.getOrThrow('naver.clientSecret'),
      callbackURL: configService.getOrThrow('naver.callbackUrl'),
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): NaverProfile {
    return {
      id: profile.id,
      email: profile.email,
      nickname: profile.nickname,
    };
  }
}
