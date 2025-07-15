import { mapEnvToConfig } from '@libs/config';

describe('mapEnvToConfig Unit Test', () => {
  it('평탄화 되어있는 env 파일내의 값들 ConfiguartionDTO 구조에 맞게 변환 확인', () => {
    // given
    const envValues = {
      NODE_ENV: 'test',
      APP_NAME: 'test',
      PORT: 3000,
    };

    // when
    const result = mapEnvToConfig(envValues);

    // then
    expect(result).toEqual({
      NODE_ENV: 'test',
      appName: 'test',
      port: 3000,
    });
  });
});
