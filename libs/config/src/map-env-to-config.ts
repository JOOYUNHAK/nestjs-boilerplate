import { ConfigurationDTO } from './configuration.dto';

/**
 *
 * env 파일들의 평탄화된 값들을 DTO에 맞게 변환시켜준다.
 */
export function mapEnvToConfig(env: Record<string, any>): ConfigurationDTO {
  return {
    NODE_ENV: env.NODE_ENV,
    appName: env.APP_NAME,
    port: env.PORT,
  };
}
