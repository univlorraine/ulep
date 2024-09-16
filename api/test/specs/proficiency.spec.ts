import { I18nService, LanguageFactory } from '@app/common';
import {
  ProficiencyQuestionFactory,
  ProficiencyTestFactory,
} from '@app/common/database/factories/proficiency.factory';
import { Test } from '@nestjs/testing';
import { AuthenticationGuard } from 'src/api/guards';
import { AppModule } from 'src/app.module';
import { ProficiencyLevel } from 'src/core/models';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { NOTIFICATION_GATEWAY } from 'src/core/ports/notification.gateway';
import { PROFICIENCY_REPOSITORY } from 'src/core/ports/proficiency.repository';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import InMemoryNotificaitonGateway from 'src/providers/gateway/in-memory-notification.gateway';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryProficiencyRepository } from 'src/providers/persistance/repositories/in-memory-proficiency.repository';
import { InMemoryI18nService } from 'src/providers/services/in-memory.i18n.provider';
import * as request from 'supertest';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { TestServer } from './test.server';

describe('Proficiency', () => {
  let app: TestServer;

  const testFactory = new ProficiencyTestFactory();
  const questionFactory = new ProficiencyQuestionFactory();
  const languageFactory = new LanguageFactory();

  const languageRepository = new InMemoryLanguageRepository();
  const repository = new InMemoryProficiencyRepository();
  const inMemoryEmail = new InMemoryEmailGateway();
  const inMemoryNotification = new InMemoryNotificaitonGateway();

  const inMemoryI18n = new InMemoryI18nService();

  beforeAll(async () => {
    // Avoid jest timeout issues
    jest.useFakeTimers({ legacyFakeTimers: true });

    const language = languageFactory.makeOne({ code: 'fr' });
    languageRepository.init([language]);

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PROFICIENCY_REPOSITORY)
      .useValue(repository)
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(languageRepository)
      .overrideProvider(EMAIL_GATEWAY)
      .useValue(inMemoryEmail)
      .overrideProvider(NOTIFICATION_GATEWAY)
      .useValue(inMemoryNotification)
      .overrideProvider(I18nService)
      .useValue(inMemoryI18n)
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

  test('Get levels should return all proficiency levels', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/proficiency/levels')
      .expect(200);

    expect(body).toHaveLength(7);
  });

  test('Create test should succeed', async () => {
    await request(app.getHttpServer())
      .post('/proficiency/tests')
      .send({ level: 'A1' })
      .expect(201);

    const createdLevel = repository.testOfLevel(ProficiencyLevel.A1);
    expect(createdLevel).toBeDefined();
  });

  test('Create test should fail if level is A0', async () => {
    await request(app.getHttpServer())
      .post('/proficiency/tests')
      .send({ level: 'A0' })
      .expect(400);
  });

  test('Get tests should return all instances', async () => {
    const A1 = testFactory.makeOne({ level: ProficiencyLevel.A1 });
    const A2 = testFactory.makeOne({ level: ProficiencyLevel.A2 });
    repository.init([A1, A2]);

    const { body } = await request(app.getHttpServer())
      .get('/proficiency/tests')
      .expect(200);

    expect(body.items).toHaveLength(2);
    expect(body.items).toEqual([
      {
        id: A1.id,
        level: A1.level,
      },
      {
        id: A2.id,
        level: A2.level,
      },
    ]);
  });

  test('Get test by id should succeed', async () => {
    const test = testFactory.makeOne({
      level: ProficiencyLevel.A1,
    });

    repository.init([test]);

    const { body } = await request(app.getHttpServer())
      .get(`/proficiency/tests/${test.id}`)
      .expect(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('level');
    expect(body).toHaveProperty('questions');
  });

  test('Get test by id should fail if test does not exist', async () => {
    await request(app.getHttpServer())
      .get(`/proficiency/tests/e8cd3534-e197-4f81-a8e6-b9e1db1c558c`)
      .expect(404);
  });

  test('Delete test by id should succeed', async () => {
    const test = testFactory.makeOne({
      level: ProficiencyLevel.A1,
    });

    repository.init([test]);

    await request(app.getHttpServer())
      .delete(`/proficiency/tests/${test.id}`)
      .expect(200);
  });

  test('Delete test by id should fail if test does not exist', async () => {
    await request(app.getHttpServer())
      .delete(`/proficiency/tests/e8cd3534-e197-4f81-a8e6-b9e1db1c558c`)
      .expect(404);
  });

  test('Find questions by level should succeed', async () => {
    const questions = questionFactory.makeMany(2);

    const test = testFactory.makeOne({
      level: ProficiencyLevel.A1,
      questions: [...questions],
    });

    repository.init([test]);

    const { body } = await request(app.getHttpServer())
      .get(`/proficiency/questions/level/A1`)
      .expect(200);

    expect(body).toHaveLength(2);
  });

  test('Create question should succeed', async () => {
    const test = testFactory.makeOne({
      level: ProficiencyLevel.A1,
    });

    repository.init([test]);

    await request(app.getHttpServer())
      .post(`/proficiency/questions`)
      .send({
        level: ProficiencyLevel.A1,
        value: "I can ask and respond to someone's news.",
      })
      .expect(201);

    const updatedTest = await repository.testOfLevel(ProficiencyLevel.A1);
    expect(updatedTest.questions).toHaveLength(1);
  });

  test('Delete question by id should succeed', async () => {
    const question = questionFactory.makeOne();

    const test = testFactory.makeOne({
      level: ProficiencyLevel.A1,
      questions: [question],
    });

    repository.init([test]);

    await request(app.getHttpServer())
      .delete(`/proficiency/questions/${question.id}`)
      .expect(200);

    const updatedTest = await repository.testOfLevel(ProficiencyLevel.A1);
    expect(updatedTest.questions).toHaveLength(0);
  });

  test('Delete question by id should fail if question does not exist', async () => {
    await request(app.getHttpServer())
      .delete(`/proficiency/questions/e8cd3534-e197-4f81-a8e6-b9e1db1c558c`)
      .expect(404);
  });
});
