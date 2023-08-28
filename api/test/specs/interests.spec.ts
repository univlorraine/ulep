import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  InterestCategoryFactory,
  InterestFactory,
  LanguageFactory,
} from '@app/common';
import { InMemoryInterestRepository } from 'src/providers/persistance/repositories/in-memory-interest.repository';
import { INTEREST_REPOSITORY } from 'src/core/ports/interest.repository';
import { TestServer } from './test.server';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { AuthenticationGuard } from 'src/api/guards';

describe('Interests', () => {
  let app: TestServer;

  const interestFactory = new InterestFactory();
  const categoryFactory = new InterestCategoryFactory();
  const languageFactory = new LanguageFactory();

  const repository = new InMemoryInterestRepository();
  const languageRepository = new InMemoryLanguageRepository();

  beforeAll(async () => {
    const language = languageFactory.makeOne({ code: 'fr' });
    languageRepository.init([language]);

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(INTEREST_REPOSITORY)
      .useValue(repository)
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(languageRepository)
      .overrideGuard(AuthenticationGuard)
      .useValue(TestAuthGuard)
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

  test('create category should succeed', async () => {
    const category = categoryFactory.makeOne();

    const { body } = await request(app.getHttpServer())
      .post('/interests/categories')
      .send({
        name: category.name.content,
        translations: [],
      })
      .expect(201);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');

    const createdCategory = await repository.categoryOfId(body.id);
    expect(createdCategory).toBeDefined();
  });

  test('create interest should succeed', async () => {
    const category = categoryFactory.makeOne();
    repository.init([category]);

    const { body } = await request(app.getHttpServer())
      .post('/interests')
      .send({
        category: category.id,
        name: 'test',
        translations: [],
      })
      .expect(201);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');

    const createdInterest = await repository.interestOfId(body.id);
    expect(createdInterest).toBeDefined();
  });

  test('create interest should fail if category does not exist', async () => {
    await request(app.getHttpServer())
      .post('/interests')
      .send({
        category: 'b1204f49-1b5e-4978-8691-34c670e9c34a',
        name: 'test',
        translations: [],
      })
      .expect(404);
  });

  test('get interests by category should succeed', async () => {
    repository.reset();

    const interest = interestFactory.makeOne();
    const category = categoryFactory.makeOne({
      interests: [interest],
    });
    repository.init([category]);

    const { body } = await request(app.getHttpServer())
      .get(`/interests/categories`)
      .expect(200);

    expect(body.items[0]).toHaveProperty('id');
    expect(body.items[0]).toHaveProperty('name');
    expect(body.items[0]).toHaveProperty('interests');
  });

  test('delete interest should succeed', async () => {
    const interest = interestFactory.makeOne();
    const category = categoryFactory.makeOne({
      interests: [interest],
    });
    repository.init([category]);

    await request(app.getHttpServer())
      .delete(`/interests/${interest.id}`)
      .expect(200);

    const deletedInterest = await repository.interestOfId(interest.id);
    expect(deletedInterest).toBeNull();
  });

  test('delete interest should fail if interest does not exist', async () => {
    await request(app.getHttpServer())
      .delete(`/interests/4be22c64-e341-4199-9175-1c43fdce3eed`)
      .expect(404);
  });

  test('delete category should succeed', async () => {
    const category = categoryFactory.makeOne();
    repository.init([category]);

    await request(app.getHttpServer())
      .delete(`/interests/categories/${category.id}`)
      .expect(200);

    const deletedCategory = await repository.categoryOfId(category.id);
    expect(deletedCategory).toBeNull();
  });
});
