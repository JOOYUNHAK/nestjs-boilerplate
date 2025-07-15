import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { CoreLoggerService } from './core-logger.service';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                  },
                },
            // Request ID 생성 (헤더 우선, 없으면 UUID)
            genReqId: req => req.headers['x-request-id'] || randomUUID(),
            // 민감 정보 필터링
            redact: ['req.headers.authorization', 'req.headers.cookie'],
            // 자동 로깅 설정 (시작/종료 로그)
            autoLogging: {
              ignore: req => req.url === '/health',
            },
            // 커스텀 시리얼라이저
            serializers: {
              req: req => ({
                requestId: req.id,
                headers: req.headers,
                method: req.method,
                url: req.url,
              }),
              res: res => ({
                statusCode: res.statusCode,
              }),
            },
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
