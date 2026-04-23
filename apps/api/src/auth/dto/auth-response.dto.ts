import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT 액세스 토큰' })
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
