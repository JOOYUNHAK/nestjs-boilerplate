import { AllCatchExceptionFilter } from '@libs/common';
import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';

describe('AllCatchExceptionFilter Unit Test', () => {
  let filter: AllCatchExceptionFilter;
  let mockHost: ArgumentsHost;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    filter = new AllCatchExceptionFilter();

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ArgumentsHost;
  });

  it('HttpException 기반 에러인 경우 반환 데이터 확인', () => {
    // given
    const error = new BadRequestException('bad request exception');

    // when
    filter.catch(error, mockHost);

    // then
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'bad request exception',
    });
  });

  it('HttpException 기반 에러가 아닌 경우 반환 데이터 확인', () => {
    // given
    const error = new Error('unknown error');

    // when
    filter.catch(error, mockHost);

    // then
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'unknown error',
    });
  });
});
