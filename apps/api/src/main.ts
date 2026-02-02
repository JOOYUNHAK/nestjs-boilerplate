import './instrument';
import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { getValidationPipeOptions } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SentryLoggerService } from '@libs/core';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });

  app.setGlobalPrefix('api');

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe(getValidationPipeOptions()));

  // [수정] nestjs-pino 대신 Custom Sentry Logger 사용
  app.useLogger(new SentryLoggerService());

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.getOrThrow('origin'),
  });

  app.enableShutdownHooks(); // for mikroorm

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Swagger example')
    .setDescription('The test API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory, { useGlobalPrefix: true });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
