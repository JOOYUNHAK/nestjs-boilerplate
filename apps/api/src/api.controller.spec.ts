import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('ApiController', () => {
  let controller: ApiController;
  let service: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: ApiService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
            debugSentry: jest.fn(),
            debugEmail: jest.fn().mockResolvedValue(undefined),
            execute: jest.fn().mockResolvedValue(null),
            startCpuProfile: jest
              .fn()
              .mockResolvedValue('CPU Profiling started'),
            stopCpuProfile: jest.fn().mockResolvedValue('/path/to/profile'),
          },
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ApiController>(ApiController);
    service = module.get<ApiService>(ApiService);
  });

  describe('debugSentry()', () => {
    it('apiService.debugSentry를 호출해야 한다', () => {
      controller.debugSentry();
      expect(service.debugSentry).toHaveBeenCalled();
    });
  });

  describe('debugThrottler()', () => {
    it('성공 메시지를 반환해야 한다', () => {
      expect(controller.debugThrottler()).toEqual({
        message: 'Throttler 테스트 API 호출 성공',
      });
    });
  });

  describe('debugEmail()', () => {
    it('apiService.debugEmail을 호출해야 한다', async () => {
      await controller.debugEmail();
      expect(service.debugEmail).toHaveBeenCalled();
    });
  });

  describe('getHello()', () => {
    it('apiService.getHello 결과를 반환해야 한다', () => {
      expect(controller.getHello(1)).toBe('Hello World!');
      expect(service.getHello).toHaveBeenCalled();
    });
  });

  describe('execute()', () => {
    it('apiService.execute를 호출해야 한다', async () => {
      await controller.execute(1);
      expect(service.execute).toHaveBeenCalledWith(1);
    });
  });

  describe('startCpuProfile()', () => {
    it('프로파일링 시작 메시지를 반환해야 한다', async () => {
      const result = await controller.startCpuProfile();
      expect(result).toEqual({ message: 'CPU Profiling started' });
    });
  });

  describe('stopCpuProfile()', () => {
    it('프로파일링 중지 결과를 반환해야 한다', async () => {
      const result = await controller.stopCpuProfile();
      expect(result).toEqual({
        message: 'Profiling stopped',
        path: '/path/to/profile',
      });
    });
  });
});
