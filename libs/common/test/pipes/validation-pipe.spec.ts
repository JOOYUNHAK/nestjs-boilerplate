import {
  getValidationPipeOptions,
  NumberValidator,
  StringValidator,
} from '@libs/common';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Expose } from 'class-transformer';

describe('ValidationPipe Unit Test', () => {
  const validationPipe: ValidationPipe = new ValidationPipe(
    getValidationPipeOptions(),
  );

  it('DTO에 정의되지 않은 프로퍼티는 변환 과정에서 제거된다..', async () => {
    // given
    class TestDTO {
      @StringValidator()
      @Expose()
      name!: string;
    }
    const dto = { name: '이름', age: 24, sex: 'male' };

    // when
    const result = await validationPipe.transform(dto, {
      metatype: TestDTO,
      type: 'body',
      data: '',
    });

    // then
    expect(result).toBeInstanceOf(TestDTO);
    expect(result).toEqual({
      name: '이름',
    });
  });

  it('DTO에 정의되어있는데 Validator 데코레이터가 없으면 에러', async () => {
    // given
    class TestDTO {
      @StringValidator()
      @Expose()
      name!: string;

      @Expose()
      age!: number;
    }
    const dto = { name: '이름', age: 24 };

    // when
    const result = async () =>
      validationPipe.transform(dto, {
        metatype: TestDTO,
        type: 'body',
        data: '',
      });

    // then
    await expect(result).rejects.toThrow(BadRequestException);
  });

  it('DTO에 @Expose()가 안붙어있는 경우 변환과정에서 제외되어 Validator 에러', async () => {
    // given
    class TestDTO {
      @StringValidator()
      @Expose()
      name!: string;

      @NumberValidator({ positive: true })
      age!: number;
    }
    const dto = { name: '이름', age: 24 };

    // when
    const result = async () =>
      validationPipe.transform(dto, {
        metatype: TestDTO,
        type: 'body',
        data: '',
      });

    // then
    await expect(result).rejects.toThrow(BadRequestException);
  });
});
