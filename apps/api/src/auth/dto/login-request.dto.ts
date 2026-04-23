import { ApiProperty } from '@nestjs/swagger';
import { StringValidator } from '@libs/common';

export class LoginRequestDto {
  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  @StringValidator({ maxLength: 255 })
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'Password1!' })
  @StringValidator()
  password: string;
}
