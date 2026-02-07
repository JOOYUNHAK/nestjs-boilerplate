import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Public } from '@libs/security';

@ApiTags('test')
@Controller('test')
@Public()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Version('1')
  @ApiOperation({
    summary: 'Sentry 테스트 Public API',
    description:
      'Sentry 테스트 API 입니다.\n사전에 프로젝트 세팅이 되어있어야합니다.',
  })
  @Get('debug-sentry')
  debugSentry() {
    return this.apiService.debugSentry();
  }

  @Version('1')
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

  @Version('1')
  @ApiOperation({
    summary: 'Email 테스트 Public API',
    description: 'Email 테스트 API 입니다.',
  })
  @Post('debug-email')
  debugEmail() {
    return this.apiService.debugEmail();
  }

  @Version('1')
  @ApiOperation({
    summary: 'CPU 프로파일링 시작',
    description: 'CPU 프로파일링을 시작합니다. (inspector session 연결)',
  })
  @Post('debug-cpu/start')
  async startCpuProfile() {
    return { message: await this.apiService.startCpuProfile() };
  }

  @Version('1')
  @ApiOperation({
    summary: 'CPU 프로파일링 종료',
    description:
      'CPU 프로파일링을 종료하고 서버 루트에 .cpuprofile 파일을 저장합니다.',
  })
  @Post('debug-cpu/stop')
  async stopCpuProfile() {
    const path = await this.apiService.stopCpuProfile();
    return { message: 'Profiling stopped', path };
  }

  @Version('1')
  @ApiOperation({
    summary: '테스트 API',
    description: '테스트를 위한 API입니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @Get(':id')
  getHello(@Param('id') _id: number): string {
    return this.apiService.getHello();
  }

  @Version('1')
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
