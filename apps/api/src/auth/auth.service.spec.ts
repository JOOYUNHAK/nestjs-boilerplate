import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { USER_REPOSITORY } from '@libs/core/repository/user';
import { AuthProvider } from '@libs/core/entity/user/auth-provider.enum';
import { User } from '@libs/core/entity/user/user.entity';
import { AppException, UiMessages } from '@libs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Record<string, jest.Mock>;
  let jwtService: { sign: jest.Mock };

  const mockUser = (overrides?: Partial<User>) => {
    const user = new User(
      'test-uuid',
      '테스트유저',
      AuthProvider.LOCAL,
      undefined,
      'test@example.com',
      undefined,
      'hashed_password',
    );
    Object.assign(user, { id: 1, ...overrides });
    return user;
  };

  beforeEach(async () => {
    userRepository = {
      findByEmail: jest.fn(),
      findByNaverId: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signup()', () => {
    const signupDto = {
      email: 'new@example.com',
      password: 'Password1!',
      nickname: '새유저',
    };

    it('새 사용자를 생성하고 JWT 토큰을 반환해야 한다', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser({ id: 2 }));

      const result = await service.signup(signupDto);

      expect(result).toBe('mock-jwt-token');
      expect(userRepository.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.any(String),
        signupDto.nickname,
        AuthProvider.LOCAL,
        expect.objectContaining({
          email: signupDto.email,
          password: expect.any(String),
        }),
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 2 });
    });

    it('비밀번호가 해싱되어 저장되어야 한다', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser());

      await service.signup(signupDto);

      const createCall = userRepository.create.mock.calls[0];
      const savedPassword = createCall[3].password;
      const isHashed = await bcrypt.compare(signupDto.password, savedPassword);
      expect(isHashed).toBe(true);
    });

    it('이미 존재하는 이메일이면 CONFLICT 예외를 던져야 한다', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser());

      await expect(service.signup(signupDto)).rejects.toThrow(AppException);
      await expect(service.signup(signupDto)).rejects.toMatchObject({
        status: HttpStatus.CONFLICT,
      });
    });
  });

  describe('login()', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password1!',
    };

    it('올바른 자격증명으로 JWT 토큰을 반환해야 한다', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      userRepository.findByEmail.mockResolvedValue(
        mockUser({ password: hashedPassword }),
      );

      const result = await service.login(loginDto);

      expect(result).toBe('mock-jwt-token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1 });
    });

    it('존재하지 않는 이메일이면 UNAUTHORIZED 예외를 던져야 한다', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(AppException);
      await expect(service.login(loginDto)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
      });
    });

    it('비밀번호가 틀리면 UNAUTHORIZED 예외를 던져야 한다', async () => {
      userRepository.findByEmail.mockResolvedValue(
        mockUser({ password: await bcrypt.hash('wrong', 10) }),
      );

      await expect(service.login(loginDto)).rejects.toThrow(AppException);
      await expect(service.login(loginDto)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
      });
    });

    it('password가 없는 사용자(OAuth)면 UNAUTHORIZED 예외를 던져야 한다', async () => {
      userRepository.findByEmail.mockResolvedValue(
        mockUser({ password: undefined }),
      );

      await expect(service.login(loginDto)).rejects.toThrow(AppException);
    });
  });

  describe('naverLogin()', () => {
    const naverProfile = {
      id: 'naver-id-123',
      email: 'naver@example.com',
      nickname: '네이버유저',
    };

    it('기존 사용자가 있으면 토큰을 반환해야 한다', async () => {
      userRepository.findByNaverId.mockResolvedValue(mockUser());

      const result = await service.naverLogin(naverProfile);

      expect(result).toBe('mock-jwt-token');
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('신규 사용자면 생성 후 토큰을 반환해야 한다', async () => {
      userRepository.findByNaverId.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser({ id: 3 }));

      const result = await service.naverLogin(naverProfile);

      expect(result).toBe('mock-jwt-token');
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.any(String),
        naverProfile.nickname,
        AuthProvider.NAVER,
        expect.objectContaining({
          email: naverProfile.email,
          naverId: naverProfile.id,
        }),
      );
    });
  });
});
