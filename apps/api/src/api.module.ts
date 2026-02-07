import './instrument';
import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { CoreModule } from '@libs/core/core.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@libs/core/entity';
import { createUseClassProvider } from '@libs/common';
import { ApiRepositoryImpl, ApiRepositoryToken } from './api.repository';
import { PoolController } from './pool/pool.controller';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreModule, MikroOrmModule.forFeature([User]), AuthModule],
  controllers: [ApiController, PoolController, HealthController],
  providers: [
    ApiService,
    createUseClassProvider(ApiRepositoryToken, ApiRepositoryImpl),
  ],
})
export class ApiModule {}
