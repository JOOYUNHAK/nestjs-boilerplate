import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { CoreLoggerService } from './core-logger.service';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Environment } from '@libs/common';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === Environment.PRODUCTION;
        return {
          pinoHttp: {
            autoLogging: true,
            level: isProduction ? 'info' : 'debug',
            // level 30 -> INFO 형식
            formatters: {
              level: label => {
                return { level: label.toUpperCase() };
              },
            },
            genReqId: req => req.headers['x-request-id'] || randomUUID(),
            // 민감 정보 필터링
            redact: ['req.headers.authorization', 'req.headers.cookie'],
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                  },
                },
            // 커스텀 시리얼라이저
            serializers: {
              req: req => ({
                requestId: req.id,
                method: req.method,
                url: req.url,
              }),

              res: res => ({
                statusCode: res.statusCode,
              }),
            },
            customProps: (_req, _res) => ({
              env: process.env.NODE_ENV,
            }),
            timestamp: () => `, "time":"${new Date().toISOString()}"`,
          },
        };
      },
    }),
  ],
  providers: [CoreLoggerService],
  exports: [CoreLoggerService],
})
export class CoreLoggerModule {}
