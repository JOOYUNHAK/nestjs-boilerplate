import { configValidateFn, NodeEnv } from '@libs/config';

describe('ConfigValidator Unit Test', () => {
  it('잘못된 값이 설정되는 경우 에러 확인', () => {
    // given
    const mockEnv = {
      ...process.env,
      NODE_ENV: 'unknown',
      APP_NAME: 'boilerplate',
      PORT: '3000',
    };

    // when
    const validate = () => configValidateFn(mockEnv);

    // then
    expect(validate).toThrow(
      new Error(
        `config validation error: NODE_ENV must be one of [test, development, staging, production]`,
      ),
    );
  });

  it('유효성 검사가 통과되면 설정 값 객체 반환', () => {
    // given
    const mockEnv = {
      ...process.env,
      NODE_ENV: NodeEnv.TEST,
      APP_NAME: 'boilerplate',
      PORT: '4200',
    };

    // when
    const validate = configValidateFn(mockEnv);

    // then
    expect(validate).toEqual({
      NODE_ENV: NodeEnv.TEST,
      APP_NAME: 'boilerplate',
      PORT: 4200,
    });
  });
});
