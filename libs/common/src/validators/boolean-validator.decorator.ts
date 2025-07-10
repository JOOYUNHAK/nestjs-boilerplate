import { applyDecorators } from '@nestjs/common';
import { IsBoolean, IsOptional } from 'class-validator';

export interface BooleanValidatorOptions {
  optional?: boolean;
  message?: string;
  each?: boolean;
}

export function BooleanValidator(
  options: BooleanValidatorOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [];

  if (options.optional) {
    decorators.push(IsOptional());
  }

  const eachOption = options.each ? true : false;
  const message =
    options.message ??
    (eachOption
      ? '$property each elements must be a boolean'
      : '$property must be a boolean');

  decorators.push(IsBoolean({ each: eachOption, message }));

  return applyDecorators(...decorators);
}

BooleanValidator.__isPrimitiveValidator = true as const;
