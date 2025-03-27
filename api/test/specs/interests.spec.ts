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

import {
  I18nService,
  InterestCategoryFactory,
  InterestFactory,
  LanguageFactory,
} from '@app/common';
import { Test } from '@nestjs/testing';
import { AuthenticationGuard } from 'src/api/guards';
import { AppModule } from 'src/app.module';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import { INTEREST_REPOSITORY } from 'src/core/ports/interest.repository';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { NOTIFICATION_GATEWAY } from 'src/core/ports/notification.gateway';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import InMemoryNotificaitonGateway from 'src/providers/gateway/in-memory-notification.gateway';
import { InMemoryInterestRepository } from 'src/providers/persistance/repositories/in-memory-interest.repository';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryI18nService } from 'src/providers/services/in-memory.i18n.provider';
import * as request from 'supertest';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { TestServer } from './test.server';

describe('Interests', () => {
  let app: TestServer;

  const interestFactory = new InterestFactory();
  const categoryFactory = new InterestCategoryFactory();
  const languageFactory = new LanguageFactory();

  const repository = new InMemoryInterestRepository();
  const languageRepository = new InMemoryLanguageRepository();
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
      .overrideProvider(INTEREST_REPOSITORY)
      .useValue(repository)
      .overrideProvider(NOTIFICATION_GATEWAY)
      .useValue(inMemoryNotification)
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(languageRepository)
      .overrideProvider(EMAIL_GATEWAY)
      .useValue(inMemoryEmail)
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
    const uuid = 'uuid-1';
    const interest = interestFactory.makeOne({
      category: uuid,
    });
    const category = categoryFactory.makeOne({
      id: uuid,
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
    const uuid = 'uuid-1';
    const interest = interestFactory.makeOne({
      category: uuid,
    });
    const category = categoryFactory.makeOne({
      id: uuid,
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
