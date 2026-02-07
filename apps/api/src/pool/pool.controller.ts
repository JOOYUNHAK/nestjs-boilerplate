import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PoolMetricsService } from '@libs/core';
import { Public } from '@libs/security';

@ApiTags('monitoring')
@Controller('pool')
@Public()
export class PoolController {
  constructor(private readonly poolMetrics: PoolMetricsService) {}

  @ApiOperation({
    summary: 'Database Connection Pool 상태 조회',
    description:
      '현재 데이터베이스 커넥션 풀의 상태를 조회합니다.\n\n' +
      '**응답 필드 설명:**\n' +
      '- `totalConnections`: 전체 커넥션 수\n' +
      '- `activeConnections`: 현재 사용 중인 커넥션 수\n' +
      '- `idleConnections`: 유휴 상태의 커넥션 수\n' +
      '- `waitingRequests`: 커넥션 대기 중인 요청 수\n' +
      '- `poolConfig`: 풀 설정 (min, max)\n\n' +
      '**모니터링 포인트:**\n' +
      '- activeConnections가 max에 가까우면 pool size 증가 고려\n' +
      '- waitingRequests가 지속적으로 발생하면 병목 가능성\n' +
      '- idleConnections가 항상 높으면 pool size 감소 고려',
  })
  @Get('status')
  async getPoolStatus() {
    return this.poolMetrics.getCurrentStatus();
  }
}
