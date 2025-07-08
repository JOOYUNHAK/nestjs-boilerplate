import { BooleanValidator } from '@libs/common';
import { validateSync } from 'class-validator';

class TestDTO {
  @BooleanValidator()
  bool!: boolean;
}

describe('BooleanValidator Unit Test', () => {
  it('boolean 형식이 아닐 때 에러 확인', () => {
    // given
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
});
