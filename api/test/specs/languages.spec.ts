import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { LanguageFactory } from '@app/common';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { TestServer } from './test.server';

describe('Languages', () => {
  let app: TestServer;

  const factory = new LanguageFactory();
  const repository = new InMemoryLanguageRepository();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(repository)
      .compile();

    app = TestServer.create(module.createNestApplication());
    await app.run();
  });

  beforeEach(() => {
    repository.reset();
  });

  afterAll(async () => {
    await app.teardown();
  });

  test('GetCollection', async () => {
    const languages = factory.makeMany(10);
    repository.init(languages);

    const { body } = await request(app.getHttpServer())
      .get('/languages')
      .expect(200);

    expect(body).toHaveLength(10);
  });
});
