import { Environment } from '@libs/common';
import { configValidateFn } from '@libs/config';

describe('ConfigValidator Unit Test', () => {
  it('잘못된 값이 설정되는 경우 에러 확인', () => {
    // given
    const mockEnv = {
      NODE_ENV: 'unknown',
      APP_NAME: 'boilerplate',
      PORT: '3000',
    };

    // when
    const validate = () => configValidateFn(mockEnv);

    // then
    expect(validate).toThrow();
  });

  it('유효성 검사가 통과되면 들어온 값 그대로 반환', () => {
    // given
    const mockEnv = {
      NODE_ENV: Environment.TEST,
      APP_NAME: 'boilerplate',
      PORT: '4200',
    };

    // when
    const validate = configValidateFn(mockEnv);

    // then
    expect(validate).toEqual({
      NODE_ENV: Environment.TEST,
      APP_NAME: 'boilerplate',
      PORT: '4200',
    });
  });
});
