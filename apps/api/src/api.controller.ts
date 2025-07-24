import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({
    summary: 'Sentry 테스트 API',
    description:
      'Sentry 테스트 API 입니다.\n사전에 프로젝트 세팅이 되어있어야합니다.',
  })
  @Get('debug-sentry')
  debugSentry() {
    return this.apiService.debugSentry();
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

  @Post(':id')
  execute(@Param('id') id: number) {
    return this.apiService.execute(id);
  }
}
