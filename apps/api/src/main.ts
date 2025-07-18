import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { getValidationPipeOptions } from '@libs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe(getValidationPipeOptions()));
  app.useLogger(app.get(Logger));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(e => console.error(e));
