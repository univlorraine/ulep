import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  KeycloakUserFactory,
  LanguageFactory,
  LearningObjectiveFactory,
} from '@app/common';
import { TestServer } from './test.server';
import { InMemoryLearningObjectiveRepository } from 'src/providers/persistance/repositories/in-memory-objective.repository';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { OBJECTIVE_REPOSITORY } from 'src/core/ports/objective.repository';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { AuthenticationGuard } from 'src/api/guards';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { AUTHENTICATOR, InMemoryAuthenticator } from 'src/api/services';

describe('Objectives', () => {
  let app: TestServer;

  const languageFactory = new LanguageFactory();
  const languageRepository = new InMemoryLanguageRepository();
  const language = languageFactory.makeOne({ code: 'en' });

  const objectiveFactory = new LearningObjectiveFactory();
  const repository = new InMemoryLearningObjectiveRepository();

  const { keycloakUser } = new KeycloakUserFactory().makeOne();
  const authenticator = new InMemoryAuthenticator(keycloakUser);

  beforeAll(async () => {
    languageRepository.init([language]);

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OBJECTIVE_REPOSITORY)
      .useValue(repository)
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(languageRepository)
      .overrideProvider(AUTHENTICATOR)
      .useValue(authenticator)
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

  describe('Objectives', () => {
    test('should determine if we keep those tests', () => {
      expect(true).toBeTruthy();
    });
  });

  // TODO(mavryn): Change this later
  /*
  describe('POST /objectives', () => {
    it('should be able to create a new objective', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/objectives')
        .send({
          name: 'Speak like a native',
          languageCode: language.code,
        })
        .expect(201);

      expect(body).toEqual(
        expect.objectContaining({
          id: '4be22c64-e341-4199-9175-1c43fdce3eed',
          name: 'Speak like a native',
        }),
      );
    });

    it('should throw an error if the objective already exists', async () => {
      const objective = objectiveFactory.makeOne();
      repository.init([objective]);

      await request(app.getHttpServer())
        .post('/objectives')
        .send({
          id: objective.id,
          name: 'Speak like a native',
          languageCode: language.code,
        })
        .expect(400);
    });

    it('should throw an error if the language does not exist', async () => {
      await request(app.getHttpServer())
        .post('/objectives')
        .send({
          id: '4be22c64-e341-4199-9175-1c43fdce3eed',
          name: 'Speak like a native',
          languageCode: 'bz',
        })
        .expect(400);
    });
  });

  describe('GET /objectives', () => {
    it('should be able to get all objectives', async () => {
      const objective = objectiveFactory.makeOne();
      repository.init([objective]);

      const { body } = await request(app.getHttpServer())
        .get('/objectives')
        .expect(200);

      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: objective.id,
            name: objective.name.content,
          }),
        ]),
      );
    });
  });

  describe('GET /objectives/:id', () => {
    it('should be able to get a single objective', async () => {
      const objective = objectiveFactory.makeOne();
      repository.init([objective]);

      const { body } = await request(app.getHttpServer())
        .get(`/objectives/${objective.id}`)
        .expect(200);

      expect(body).toEqual(
        expect.objectContaining({
          id: objective.id,
          name: objective.name.content,
        }),
      );
    });

    it('should throw an error if the objective does not exist', async () => {
      await request(app.getHttpServer())
        .get('/objectives/4be22c64-e341-4199-9175-1c43fdce3eed')
        .expect(404);
    });
  });

  describe('DELETE /objectives/:id', () => {
    it('should be able to delete an objective', async () => {
      const objective = objectiveFactory.makeOne();
      repository.init([objective]);

      await request(app.getHttpServer())
        .delete(`/objectives/${objective.id}`)
        .expect(200);
    });

    it('should throw an error if the objective does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/objectives/4be22c64-e341-4199-9175-1c43fdce3eed')
        .expect(404);
    });
  });*/
});
