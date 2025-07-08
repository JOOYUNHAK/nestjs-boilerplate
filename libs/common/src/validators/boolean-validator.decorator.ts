import { applyDecorators } from '@nestjs/common';
import { IsBoolean, IsOptional } from 'class-validator';

export interface BooleanValidatorOptions {
  optional?: boolean;
  message?: string;
}

export function BooleanValidator(
  options: BooleanValidatorOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [];

  if (options.optional) {
    decorators.push(IsOptional());
  }

  decorators.push(
    IsBoolean({ message: options.message ?? '$property must be a boolean' }),
  );

  return applyDecorators(...decorators);
}
