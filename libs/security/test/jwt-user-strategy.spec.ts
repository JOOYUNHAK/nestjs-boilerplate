import { AppException, UiMessages } from '@libs/common';
import { JwtUserStrategy } from '@libs/security/jwt-user.strategy';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('JwtUserStrategy Unit Test', () => {
  let strategy: JwtUserStrategy, configService: ConfigService;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValueOnce('test_jwt_secret'),
    } as unknown as ConfigService;

    strategy = new JwtUserStrategy(configService);
  });

  describe('validate()', () => {
    it('payload의 sub 프로퍼티가 falsy인 경우 AppException', () => {
      // given
      const falsySubs = [null, undefined];

      // then
      falsySubs.forEach((sub: any) => {
        const result = () => strategy.validate({ sub });
        expect(result).toThrow(
          new AppException(
            UiMessages.UNAUTHORIZED,
            `Not found sub`,
            HttpStatus.UNAUTHORIZED,
          ),
        );
      });
    });
  });
});
