import { plainToInstance } from 'class-transformer';
import { ConfigurationDTO } from './configuration.dto';
import { validateSync } from 'class-validator';

export function configValidateFn(config: Record<string, any>) {
  // config는 process.env에 설정되어있는 값들이 들어온다.
  const dto = plainToInstance(ConfigurationDTO, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(dto, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length) {
    const message = errors
      .map(err => Object.values(err.constraints || {}).join(', '))
      .join('; ');

    throw new Error(`config validation error: ${message}`);
  }
  return dto;
}
