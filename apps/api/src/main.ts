import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { getValidationPipeOptions } from '@libs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });

  app.setGlobalPrefix('api');

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe(getValidationPipeOptions()));
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.getOrThrow('origin'),
  });

  app.enableShutdownHooks(); // for mikroorm

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(e => console.error(e));
