import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiModule } from './../src/api.module';
import { setupTestApp } from '@libs/testing';
import { ConfigService } from '@nestjs/config';
import { ThrottlerException } from '@nestjs/throttler';

describe('ApiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    setupTestApp(app);

    await app.init();
  });

  it('/api/test/:id (GET)', () => {
    return request(app.getHttpServer()).get('/api/test/1').expect(200);
  });

  it('/api/test/debug-throttle (GET)', async () => {
    // given
    const configService = app.get(ConfigService);
    const limit = configService.getOrThrow('throttle.limit');

    for (let i = 0; i < limit; i++) {
      await request(app.getHttpServer()).get('/api/test/debug-throttle');
    }

    return request(app.getHttpServer())
      .get('/api/test/debug-throttle')
      .expect(429) // 429 Too Many Requests
      .catch(err => {
        expect(err).toBeInstanceOf(ThrottlerException);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
