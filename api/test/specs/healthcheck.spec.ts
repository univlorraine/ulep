import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TestServer } from './test.server';

describe('Health', () => {
  let app: TestServer;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = TestServer.create(module.createNestApplication());
    await app.run();
  });

  afterAll(async () => {
    await app.teardown();
  });

  test('Ping', async () => {
    await request(app.getHttpServer()).get('/health').expect(200);
  });
});
