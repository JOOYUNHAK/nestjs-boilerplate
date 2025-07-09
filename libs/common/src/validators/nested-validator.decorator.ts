import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

interface NestedValidatorOptions {
  each?: boolean;
}

export function NestedValidator(
  typeFn: () => Function,
  options: NestedValidatorOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [];

  decorators.push(ValidateNested({ each: options.each ? true : false }));
  decorators.push(Type(typeFn));

  return applyDecorators(...decorators);
}
