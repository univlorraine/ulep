/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { I18nService, KeycloakUserFactory, LanguageFactory } from '@app/common';
import { TestServer } from './test.server';
import { InMemoryLearningObjectiveRepository } from 'src/providers/persistance/repositories/in-memory-objective.repository';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { OBJECTIVE_REPOSITORY } from 'src/core/ports/objective.repository';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { AuthenticationGuard } from 'src/api/guards';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { AUTHENTICATOR, InMemoryAuthenticator } from 'src/api/services';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import { InMemoryI18nService } from 'src/providers/services/in-memory.i18n.provider';
import { NOTIFICATION_GATEWAY } from 'src/core/ports/notification.gateway';
import InMemoryNotificaitonGateway from 'src/providers/gateway/in-memory-notification.gateway';

describe('Objectives', () => {
  let app: TestServer;

  const languageFactory = new LanguageFactory();
  const languageRepository = new InMemoryLanguageRepository();
  const language = languageFactory.makeOne({ code: 'en' });

  const repository = new InMemoryLearningObjectiveRepository();

  const { keycloakUser } = new KeycloakUserFactory().makeOne();
  const authenticator = new InMemoryAuthenticator(keycloakUser);
  const inMemoryEmail = new InMemoryEmailGateway();
  const inMemoryNotification = new InMemoryNotificaitonGateway();
  const inMemoryI18n = new InMemoryI18nService();

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
