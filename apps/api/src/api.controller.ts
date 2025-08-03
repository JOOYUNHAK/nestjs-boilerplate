import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('test')
@Controller('test')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({
    summary: 'Sentry 테스트 Public API',
    description:
      'Sentry 테스트 API 입니다.\n사전에 프로젝트 세팅이 되어있어야합니다.',
  })
  @Get('debug-sentry')
  debugSentry() {
    return this.apiService.debugSentry();
  }

  @ApiOperation({
    summary: 'Throttle 테스트 Public API',
    description:
      'Throttle 테스트 API 입니다. \n env 파일의 값을 조정하여 시도하세요.',
  })
  @UseGuards(ThrottlerGuard)
  @Get('debug-throttle')
  debugThrottler() {
    return { message: 'Throttler 테스트 API 호출 성공' };
  }

  @ApiOperation({
    summary: 'Email 테스트 Public API',
    description: 'Email 테스트 API 입니다.',
  })
  @Post('debug-email')
  debugEmail() {
    return this.apiService.debugEmail();
  }

  @ApiOperation({
    summary: '테스트 API',
    description: '테스트를 위한 API입니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @Get(':id')
  getHello(@Param('id') _id: number): string {
    return this.apiService.getHello();
  }

  @ApiOperation({
    summary: '테스트 API',
    description: '테스트를 위한 API입니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @Post(':id')
  execute(@Param('id') id: number) {
    return this.apiService.execute(id);
  }
}
