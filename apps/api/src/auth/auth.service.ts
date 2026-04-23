import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, USER_REPOSITORY } from '@libs/core/repository/user';
import { AuthProvider } from '@libs/core/entity/user/auth-provider.enum';
import { NaverProfile } from '@libs/security';
import { AppException, UiMessages } from '@libs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { SignupRequestDto } from './dto/signup-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupRequestDto): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppException(
        UiMessages.EMAIL_ALREADY_EXISTS,
        `Email already exists: ${dto.email}`,
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      AuthService.SALT_ROUNDS,
    );

    const user = await this.userRepository.create(
      uuidv4(),
      dto.nickname,
      AuthProvider.LOCAL,
      {
        email: dto.email,
        password: hashedPassword,
      },
    );

    return this.generateToken(user.id);
  }

  async login(dto: LoginRequestDto): Promise<string> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new AppException(
        UiMessages.INVALID_CREDENTIALS,
        `Login failed: user not found for email ${dto.email}`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new AppException(
        UiMessages.INVALID_CREDENTIALS,
        `Login failed: invalid password for email ${dto.email}`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.generateToken(user.id);
  }

  async naverLogin(profile: NaverProfile): Promise<string> {
    let user = await this.userRepository.findByNaverId(profile.id);

    if (!user) {
      user = await this.userRepository.create(
        uuidv4(),
        profile.nickname ?? '',
        AuthProvider.NAVER,
        {
          email: profile.email,
          naverId: profile.id,
        },
      );
    }

    return this.generateToken(user.id);
  }

  private generateToken(userId: number): string {
    return this.jwtService.sign({ sub: userId });
  }
}
