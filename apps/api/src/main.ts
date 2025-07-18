import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { getValidationPipeOptions } from '@libs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Swagger example')
    .setDescription('The test API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory, { useGlobalPrefix: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(e => console.error(e));
