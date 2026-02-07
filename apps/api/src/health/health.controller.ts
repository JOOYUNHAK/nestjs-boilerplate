import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@libs/security';

@ApiTags('health')
@Controller()
@Public()
export class HealthController {
  @ApiOperation({ summary: 'Health Check' })
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
