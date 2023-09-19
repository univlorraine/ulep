import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TestServer } from './test.server';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';

describe('Health', () => {
  let app: TestServer;
  const inMemoryEmail = new InMemoryEmailGateway();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EMAIL_GATEWAY)
      .useValue(inMemoryEmail)
      .compile();

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
