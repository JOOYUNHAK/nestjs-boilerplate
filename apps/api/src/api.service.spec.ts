import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { ApiRepositoryToken } from './api.repository';
import { EMAIL_CLIENT } from '@libs/core';

describe('ApiService', () => {
  let service: ApiService;
  let mockRepository: { findById: jest.Mock };
  let mockEmailService: { send: jest.Mock };

  beforeEach(async () => {
    mockRepository = { findById: jest.fn() };
    mockEmailService = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        { provide: ApiRepositoryToken, useValue: mockRepository },
        { provide: EMAIL_CLIENT, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<ApiService>(ApiService);
  });

  describe('getHello()', () => {
    it('"Hello World!"를 반환해야 한다', () => {
      expect(service.getHello()).toBe('Hello World!');
    });
  });

  describe('debugSentry()', () => {
    it('에러를 throw해야 한다', () => {
      expect(() => service.debugSentry()).toThrow(
        'Unexpected error to test sentry integration',
      );
    });
  });

  describe('execute()', () => {
    it('repository.findById를 호출해야 한다', async () => {
      mockRepository.findById.mockResolvedValue(null);
      const result = await service.execute(1);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('debugEmail()', () => {
    it('emailService.send를 호출해야 한다', async () => {
      mockEmailService.send.mockResolvedValue(undefined);
      await service.debugEmail();
      expect(mockEmailService.send).toHaveBeenCalledWith({
        to: ['wndbsgkr@gmail.com'],
        subject: 'Test Email',
        html: '<p>Hello Test</p>',
      });
    });
  });
});
