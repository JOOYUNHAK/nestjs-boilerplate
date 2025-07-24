import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export interface BooleanValidatorOptions {
  optional?: boolean;
  message?: string;
  each?: boolean;
}

export type BooleanValidatorType = (
  opts?: BooleanValidatorOptions,
) => PropertyDecorator;

export function BooleanValidator(
  options: BooleanValidatorOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [];

  if (options.optional) {
    decorators.push(IsOptional());
  } else {
    decorators.push(IsNotEmpty());
  }

  decorators.push(
    Transform(({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    }),
  );

  const eachOption = options.each ? true : false;
  const message =
    options.message ??
    (eachOption
      ? '$property each elements must be a boolean'
      : '$property must be a boolean');

  decorators.push(IsBoolean({ each: eachOption, message }));

  return applyDecorators(...decorators);
}
