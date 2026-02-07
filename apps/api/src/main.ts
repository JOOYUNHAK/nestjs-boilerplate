import './instrument';
import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { getValidationPipeOptions } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SentryLoggerService } from '@libs/core';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });

  app.setGlobalPrefix('api');

  // API 버전 관리 활성화
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe(getValidationPipeOptions()));

  // [수정] nestjs-pino 대신 Custom Sentry Logger 사용
  app.useLogger(new SentryLoggerService());

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.getOrThrow('origin'),
  });

  app.enableShutdownHooks(); // for mikroorm

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Boilerplate API')
    .setDescription('NestJS 모노레포 보일러플레이트 API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/api/v1', 'API v1')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory, { useGlobalPrefix: true });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
