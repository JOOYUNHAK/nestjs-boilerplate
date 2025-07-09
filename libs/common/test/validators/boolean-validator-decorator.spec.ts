import { BooleanValidator } from '@libs/common';
import { validateSync } from 'class-validator';

describe('BooleanValidator Unit Test', () => {
  it('boolean 형식이 아닐 때 에러 확인', () => {
    // given
    class TestDTO {
      @BooleanValidator()
      bool!: boolean;
    }

    const dto = Object.assign(new TestDTO(), { bool: 'true ' });

    // when
    const errors = validateSync(dto);

    // then
    expect(errors).toHaveLength(1);
    expect(errors.at(0)).toMatchObject({
      property: 'bool',
      constraints: {
        isBoolean: 'bool must be a boolean',
      },
    });
  });

  it('배열일 경우 내부 요소 확인', () => {
    // given
    class TestArrayDTO {
      @BooleanValidator({ each: true })
      bools!: boolean[];
    }

    const dto = Object.assign(new TestArrayDTO(), {
      bools: [true, false, 'true'],
    });

    // when
    const errors = validateSync(dto);

    // then
    expect(errors).toHaveLength(1);
    expect(errors.at(0)).toMatchObject({
      property: 'bools',
      constraints: {
        isBoolean: 'bools each elements must be a boolean',
      },
    });
  });
});
