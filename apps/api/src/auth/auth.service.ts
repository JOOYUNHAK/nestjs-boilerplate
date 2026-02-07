import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository, USER_REPOSITORY } from '@libs/core/repository/user';
import { AuthProvider } from '@libs/core/entity/user/user.entity';
import { NaverProfile } from '@libs/security';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async naverLogin(profile: NaverProfile): Promise<string> {
    let user = await this.userRepository.findByNaverId(profile.id);

    if (!user) {
      user = await this.userRepository.create(
        uuidv4(),
        profile.nickname,
        AuthProvider.NAVER,
        {
          email: profile.email,
          naverId: profile.id,
        },
      );
    }

    const payload = { sub: user.id };
    return this.jwtService.sign(payload);
  }
}
