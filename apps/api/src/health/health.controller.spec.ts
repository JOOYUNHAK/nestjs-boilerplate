import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('health()', () => {
    it('{ status: "ok" }을 반환해야 한다', () => {
      expect(controller.health()).toEqual({ status: 'ok' });
    });
  });
});
