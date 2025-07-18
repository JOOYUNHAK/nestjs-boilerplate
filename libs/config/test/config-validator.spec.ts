import { configValidateFn } from '@libs/config';
import { getMockEnv } from '@libs/testing';

describe('ConfigValidator Unit Test', () => {
  it('잘못된 값이 설정되는 경우 에러 확인', () => {
    // given
    const env = getMockEnv();

    // when
    const validate = () => configValidateFn({ ...env, NODE_ENV: 'unvalid' });

    // then
    expect(validate).toThrow();
  });

  it('유효성 검사가 통과되면 들어온 값 그대로 반환', () => {
    // given
    const env = getMockEnv();

    // when
    const validate = configValidateFn(env);

    // then
    expect(validate).toStrictEqual(env);
  });
});
