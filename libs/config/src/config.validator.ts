import { plainToInstance } from 'class-transformer';
import { ConfigurationDTO } from './configuration.dto';
import { validateSync } from 'class-validator';
import { mapEnvToConfig } from './map-env-to-config';

export function configValidateFn(config: Record<string, any>) {
  // config는 process.env에 설정되어있는 값들이 들어온다.
  const dto = plainToInstance(ConfigurationDTO, mapEnvToConfig(config), {
    enableImplicitConversion: true,
  });

  const errors = validateSync(dto, { skipMissingProperties: false });

  if (errors.length) {
    throw new Error(`config validation error:\n- ${errors.toString()}`);
  }

  // env 파일에 있는 값들의 유효성 검사만 하고 process.env 그대로 반환한다.
  return config;
}
