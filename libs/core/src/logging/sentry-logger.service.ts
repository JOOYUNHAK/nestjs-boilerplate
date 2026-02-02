import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';

@Injectable({ scope: Scope.TRANSIENT })
export class SentryLoggerService extends ConsoleLogger {
  // 헬스 체크 관련 컨텍스트 무시 목록
  private readonly ignoredContexts = new Set([
    'Terminus',
    'HealthController',
    'HealthCheckService',
    'RouterExplorer', // 초기 라우터 매핑 로그 노이즈 제거
    'InstanceLoader', // 초기 모듈 로딩 노이즈 제거
  ]);

  private get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  log(message: any, ...optionalParams: any[]) {
    // 1. 기본 콘솔 출력 (로컬/운영 모두)
    super.log(message, ...optionalParams);

    // 2. 운영 환경이 아니거나, 무시할 컨텍스트면 Sentry 전송 Skip
    if (!this.isProduction || this.shouldIgnore(message, optionalParams)) {
      return;
    }

    // 3. [Wide Event 패턴 적용]
    // 메시지가 객체이면 Context로 풀어서 전송, 문자열이면 Context에 param으로 추가
    const logContext = typeof message === 'object' ? message : { message };
    const extraContext = optionalParams.length ? { args: optionalParams } : {};

    // Sentry Logs (Structured Logging) 전송
    // Requires SDK >= 9.41.0
    if (Sentry.logger) {
      Sentry.logger.info(
        typeof message === 'string' ? message : JSON.stringify(message),
        {
          ...logContext,
          ...extraContext,
          logger: 'SentryLogger',
          context: this.getContextName(optionalParams),
        },
      );
    }
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);

    if (!this.isProduction) {
      return;
    }

    // Sentry Logger Error
    if (Sentry.logger) {
      Sentry.logger.error(String(message), {
        stack,
        context,
        logger: 'SentryLogger',
      });
    }

    // Error는 여전히 Breadcrumb으로 남겨서 Traceability 확보 (Alert는 전역 필터 담당)
    Sentry.addBreadcrumb({
      category: 'error',
      message: String(message),
      level: 'error',
      data: {
        stack,
        context,
      },
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);

    if (!this.isProduction || this.shouldIgnore(message, optionalParams)) {
      return;
    }

    // Sentry Logger Warn
    if (Sentry.logger) {
      Sentry.logger.warn(String(message), {
        context: this.getContextName(optionalParams),
        logger: 'SentryLogger',
      });
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
    // Debug log to Sentry (optional, usually high volume)
    // if (this.isProduction && Sentry.logger) {
    //   Sentry.logger.debug(String(message), { ... });
    // }
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
  }

  // 컨텍스트 이름 추출 헬퍼 (NestJS는 마지막 인자로 context를 자주 넘김)
  private getContextName(args: any[]): string {
    if (args.length > 0 && typeof args[args.length - 1] === 'string') {
      return args[args.length - 1];
    }
    return 'Unknown';
  }

  /**
   * 헬스 체크나 노이즈 로그인지 판별
   */
  private shouldIgnore(message: any, params?: any[]): boolean {
    const context = this.getContextName(params || []);
    if (this.ignoredContexts.has(context)) {
      return true;
    }

    const msgStr = String(message);
    // 헬스 체크 URL 로그 필터링
    if (msgStr.includes('/health') || msgStr.includes('Health Check')) {
      return true;
    }

    return false;
  }
}
