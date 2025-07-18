import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { CoreModule } from '@libs/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
