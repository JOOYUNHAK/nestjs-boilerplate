import { ApiProperty } from '@nestjs/swagger';
import { StringValidator } from '@libs/common';

export class SignupRequestDto {
  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  @StringValidator({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
    message: '유효한 이메일 형식이어야 합니다.',
  })
  email: string;

  @ApiProperty({ description: '비밀번호 (8~30자)', example: 'Password1!' })
  @StringValidator({
    minLength: 8,
    maxLength: 30,
    pattern:
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
    message:
      '비밀번호는 8~30자이며, 영문/숫자/특수문자를 각각 1개 이상 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({ description: '닉네임 (2~20자)', example: '홍길동' })
  @StringValidator({ trim: true, minLength: 2, maxLength: 20 })
  nickname: string;
}
