import {
  NestedValidator,
  NumberValidator,
  StringValidator,
} from '@libs/common';
import { validateSync } from 'class-validator';

class NestedNumTestDTO {
  @NumberValidator({ min: 5 })
  num!: number;
}

class NestedStrTestDTO {
  @StringValidator({ optional: false })
  str!: string;

  @NestedValidator(() => NestedNumTestDTO)
  num!: NestedNumTestDTO;
}

class TestDTO {
  @NestedValidator(() => NestedStrTestDTO, { each: true })
  nested: NestedStrTestDTO[];
}

describe('NestedValidator Unit Test', () => {
  it('중첩 객체 에러 확인', () => {
    // given
    const numDto: NestedNumTestDTO = Object.assign(new NestedNumTestDTO(), {
      num: 3,
    });
    const strDto: NestedStrTestDTO = Object.assign(new NestedStrTestDTO(), {
      num: numDto,
    });
    const strDto2: NestedStrTestDTO = Object.assign(new NestedStrTestDTO(), {
      str: '테스트',
      num: numDto,
    });
    const testDto: TestDTO = Object.assign(new TestDTO(), {
      nested: Array.of(strDto, strDto2),
    });

    // when
    const errors = validateSync(testDto);

    // then
    const error = errors.at(0);
    expect(error?.children).toHaveLength(2);
  });
});
