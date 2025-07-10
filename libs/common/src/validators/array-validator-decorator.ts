// src/common/validators/array-validator.decorator.ts

import { applyDecorators } from '@nestjs/common';
import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
} from 'class-validator';
import { PrimitiveValidatorFunction } from './primitive-validator.interface';

export interface ArrayValidatorOptions {
  optional?: boolean;
  minItems?: number;
  maxItems?: number;
  message?: string;
}

export interface ElementValidatorConfig<
  D extends PrimitiveValidatorFunction<any>,
> {
  /**
   *
   * StringValidator, NumberValidator ...
   */
  decorator: D;
  /**
   *
   * 해당 데코레이터의 옵션 (each는 내부에서 자동 처리)
   */
  options: Omit<NonNullable<Parameters<D>[0]>, 'each'>;
}

export function ArrayValidator<D extends PrimitiveValidatorFunction<any>>(
  options: ArrayValidatorOptions = {},
  elementValidator?: ElementValidatorConfig<D>,
) {
  const decorators: PropertyDecorator[] = [];

  if (options.optional) {
    decorators.push(IsOptional());
  }

  decorators.push(
    IsArray({ message: options.message ?? `$property must be an array` }),
  );

  if (options.minItems) {
    decorators.push(
      ArrayMinSize(options.minItems, {
        message:
          options.message ??
          `$property must contain at least ${options.minItems} items`,
      }),
    );
  }

  if (options.maxItems) {
    decorators.push(
      ArrayMaxSize(options.maxItems, {
        message:
          options.message ??
          `$property must contain no more than ${options.maxItems} items`,
      }),
    );
  }

  if (elementValidator) {
    const { decorator, options: elementOpts } = elementValidator;
    decorators.push(
      decorator({
        ...elementOpts,
        each: true, // each: true 자동 적용
      }),
    );
  }

  return applyDecorators(...decorators);
}
