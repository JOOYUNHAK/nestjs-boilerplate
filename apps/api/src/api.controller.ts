import { Controller, Get, Param } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({
    summary: '테스트 API',
    description: '테스트를 위한 API입니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @Get(':id')
  getHello(@Param('id') id: number): string {
    return this.apiService.getHello();
  }
}
