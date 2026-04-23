import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicApi } from '@libs/security';

@ApiTags('health')
@Controller()
@PublicApi()
export class HealthController {
  @ApiOperation({ summary: 'Health Check' })
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
