import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getValidationPipeOptions } from '@libs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalPipes(new ValidationPipe(getValidationPipeOptions()));
  app.useLogger(app.get(Logger));

  await app.listen(3000);
}
void bootstrap();
