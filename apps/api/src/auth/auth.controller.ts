import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NaverGuard, NaverProfile, PublicApi } from '@libs/security';
import { ApiStandardResponse } from '@libs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dto/signup-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '이메일 회원가입' })
  @ApiStandardResponse(AuthResponseDto)
  @PublicApi()
  @Post('signup')
  async signup(@Body() dto: SignupRequestDto): Promise<AuthResponseDto> {
    const token = await this.authService.signup(dto);
    return new AuthResponseDto(token);
  }

  @ApiOperation({ summary: '이메일 로그인' })
  @ApiStandardResponse(AuthResponseDto)
  @PublicApi()
  @Post('login')
  async login(@Body() dto: LoginRequestDto): Promise<AuthResponseDto> {
    const token = await this.authService.login(dto);
    return new AuthResponseDto(token);
  }

  @ApiOperation({ summary: '네이버 로그인' })
  @PublicApi()
  @Get('naver')
  @UseGuards(NaverGuard)
  naverLogin() {
    // Guard가 리다이렉트 처리
  }

  @ApiOperation({ summary: '네이버 로그인 콜백' })
  @PublicApi()
  @Get('naver/callback')
  @UseGuards(NaverGuard)
  async naverCallback(
    @Req() req: Request & { user: NaverProfile },
    @Res() res: Response,
  ) {
    const token = await this.authService.naverLogin(req.user);

    // Secure Cookie에 JWT 저장
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1일
    });

    // 프론트엔드로 리다이렉트 (환경변수로 설정 가능)
    return res.redirect('/');
  }
}
