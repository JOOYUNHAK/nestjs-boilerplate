import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { NaverGuard, NaverProfile, PublicApi } from '@libs/security';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
