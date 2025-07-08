import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsInt, IsOptional, Min, Max } from 'class-validator';

export interface NumberValidatorOptions {
  optional?: boolean;
  integer?: boolean;
  positive?: boolean;
  min?: number;
  max?: number;
  message?: string;
}

export function NumberValidator(
  options: NumberValidatorOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [];

  // 1) 문자열로 전달된 숫자를 Number 타입으로 변환
  decorators.push(
    Transform(({ value }) => {
      if (typeof value === 'string' && value.trim() !== '') {
        const num = Number(value);
        return isNaN(num) ? value : num;
      }
      return value;
    }),
  );

  // 2) 선택 필드는 optional
  if (options.optional) {
    decorators.push(IsOptional());
  }

  // 3) 정수/숫자 타입 검사
  if (options.integer) {
    decorators.push(
      IsInt({ message: options.message ?? '$property must be an integer' }),
    );
  } else {
    decorators.push(
      IsNumber(
        {},
        { message: options.message ?? '$property must be a number' },
      ),
    );
  }

  // 4) 양수 검사
  if (options.positive) {
    decorators.push(
      Min(1, {
        message: options.message ?? '$property must be a positive number',
      }),
    );
  }

  // 5) 최소값/최대값 검사
  if (options.min != null) {
    decorators.push(
      Min(options.min, {
        message: options.message ?? `$property must be >= ${options.min}`,
      }),
    );
  }
  if (options.max != null) {
    decorators.push(
      Max(options.max, {
        message: options.message ?? `$property must be <= ${options.max}`,
      }),
    );
  }

  return applyDecorators(...decorators);
}
