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
  CountryFactory,
  I18nService,
  KeycloakUserFactory,
  LanguageFactory,
  UniversityFactory,
  UserFactory,
} from '@app/common';
import { InstanceFactory } from '@app/common/database/factories/instance.factory';
import { KeycloakClient } from '@app/keycloak';
import { Test } from '@nestjs/testing';
import { AuthenticationGuard } from 'src/api/guards';
import { AUTHENTICATOR, InMemoryAuthenticator } from 'src/api/services';
import { AppModule } from 'src/app.module';
import { PairingMode } from 'src/core/models';
import { COUNTRY_REPOSITORY } from 'src/core/ports/country.repository';
import { EDITO_REPOSITORY } from 'src/core/ports/edito.repository';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import { INSTANCE_REPOSITORY } from 'src/core/ports/instance.repository';
import { LEARNING_LANGUAGE_REPOSITORY } from 'src/core/ports/learning-language.repository';
import { NOTIFICATION_GATEWAY } from 'src/core/ports/notification.gateway';
import { UNIVERSITY_REPOSITORY } from 'src/core/ports/university.repository';
import { USER_REPOSITORY } from 'src/core/ports/user.repository';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import InMemoryNotificaitonGateway from 'src/providers/gateway/in-memory-notification.gateway';
import { InMemoryCountryCodesRepository } from 'src/providers/persistance/repositories/in-memory-country-repository';
import { InMemoryEditoRepository } from 'src/providers/persistance/repositories/in-memory-edito-repository';
import { InMemoryInstanceRepository } from 'src/providers/persistance/repositories/in-memory-instance-repository';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryLearningLanguageRepository } from 'src/providers/persistance/repositories/in-memory-learning-language-repository';
import { InMemoryUniversityRepository } from 'src/providers/persistance/repositories/in-memory-university-repository';
import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';
import { InMemoryI18nService } from 'src/providers/services/in-memory.i18n.provider';
import * as request from 'supertest';
import { LANGUAGE_REPOSITORY } from '../../src/core/ports/language.repository';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { TestServer } from './test.server';

describe('Universities', () => {
  let app: TestServer;

  const userRepositoy = new InMemoryUserRepository();
  const countryRepository = new InMemoryCountryCodesRepository();
  const universityFactory = new UniversityFactory();
  const university = universityFactory.makeOne();
  const userFactory = new UserFactory();
  const user = userFactory.makeOne({ university });
  const { keycloakUser } = new KeycloakUserFactory().makeOne({ user });
  const instanceFactory = new InstanceFactory();
  const instance = instanceFactory.makeOne();
  const authenticator = new InMemoryAuthenticator(keycloakUser);
  const learningLanguageRepository = new InMemoryLearningLanguageRepository();
  const instanceRepository = new InMemoryInstanceRepository();
  const countryFactory = new CountryFactory();
  const country = countryFactory.makeOne();

  const languageFactory = new LanguageFactory();
  const languages = [
    languageFactory.makeOne({ code: 'en', name: 'English' }),
    languageFactory.makeOne({ code: 'fr', name: 'French' }),
  ];
  const languageRepository = new InMemoryLanguageRepository();

  const repository = new InMemoryUniversityRepository();
  const inMemoryEmail = new InMemoryEmailGateway();
  const inMemoryNotification = new InMemoryNotificaitonGateway();
  const inMemoryI18n = new InMemoryI18nService();
  const inMemoryEdito = new InMemoryEditoRepository();

  beforeAll(async () => {
    userRepositoy.init([user]);
    countryRepository.init([country]);
    languageRepository.init(languages);
    instanceRepository.init(instance);

    const keycloak = new KeycloakClient({
      realm: 'test',
      username: 'test',
      password: 'password',
      clientId: 'test',
      clientSecret: 'secret',
      baseUrl: 'http://localhost:8080/auth',
      adminRoleName: 'admin',
    });

    jest
      .spyOn(keycloak, 'getAdministrators')
      .mockImplementation(() => Promise.resolve([]));

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UNIVERSITY_REPOSITORY)
      .useValue(repository)
      .overrideProvider(COUNTRY_REPOSITORY)
      .useValue(countryRepository)
      .overrideProvider(USER_REPOSITORY)
      .useValue(userRepositoy)
      .overrideProvider(EMAIL_GATEWAY)
      .useValue(inMemoryEmail)
      .overrideProvider(NOTIFICATION_GATEWAY)
      .useValue(inMemoryNotification)
      .overrideGuard(AuthenticationGuard)
      .useValue(TestAuthGuard)
      .overrideProvider(I18nService)
      .useValue(inMemoryI18n)
      .overrideProvider(AUTHENTICATOR)
      .useValue(authenticator)
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(languageRepository)
      .overrideProvider(LEARNING_LANGUAGE_REPOSITORY)
      .useValue(learningLanguageRepository)
      .overrideProvider(INSTANCE_REPOSITORY)
      .useValue(instanceRepository)
      .overrideProvider(KeycloakClient)
      .useValue(keycloak)
      .overrideProvider(EDITO_REPOSITORY)
      .useValue(inMemoryEdito)
      .compile();

    app = TestServer.create(module.createNestApplication());
    await app.run();
  });

  beforeEach(() => {
    countryRepository.init([country]);
    repository.reset();
  });

  afterAll(async () => {
    await app.teardown();
  });

  it('should create university', async () => {
    await request(app.getHttpServer())
      .post('/universities')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        name: 'University of Oxford',
        campusNames: ['Oxford'],
        timezone: 'Europe/London',
        admissionStart: '2021-01-01',
        admissionEnd: '2021-12-31',
        openServiceDate: '2022-01-01',
        closeServiceDate: '2024-12-31',
        website: 'https://www.ox.ac.uk/',
        codes: [],
        domains: [],
        countryId: country.id,
        pairingMode: PairingMode.SEMI_AUTOMATIC,
        maxTandemsPerUser: 3,
        nativeLanguageId: languages[0].id,
      })
      .expect(201);
  });

  it('should return bad request if university central already exists', async () => {
    countryRepository.init([country]);

    const university = universityFactory.makeOne();
    repository.init([university]);

    await request(app.getHttpServer())
      .post('/universities')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        id: '4be22c64-e341-4199-9175-1c43fdce3eed',
        name: 'University of Oxford',
        campusNames: ['Oxford'],
        timezone: 'Europe/London',
        admissionStart: '2021-01-01',
        admissionEnd: '2021-12-31',
        openServiceDate: '2022-01-01',
        closeServiceDate: '2024-12-31',
        website: 'https://www.ox.ac.uk/',
        pairingMode: PairingMode.SEMI_AUTOMATIC,
        maxTandemsPerUser: 3,
        nativeLanguageId: languages[0].id,
      })
      .expect(400);
  });

  it('should return bad request if admission start date is after admission end date', async () => {
    await request(app.getHttpServer())
      .post('/universities')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        id: '4be22c64-e341-4199-9175-1c43fdce3eed',
        name: 'University of Oxford',
        campusNames: ['Oxford'],
        timezone: 'Europe/London',
        admissionStart: '2021-12-31',
        admissionEnd: '2021-01-01',
        openServiceDate: '2022-01-01',
        closeServiceDate: '2024-12-31',
        website: 'https://www.ox.ac.uk/',
        maxTandemsPerUser: 3,
        nativeLanguageId: languages[0].id,
      })
      .expect(400);
  });

  /*it('should create partner university', async () => {
      const university = universityFactory.makeOne();
      repository.init([university]);
  
      await request(app.getHttpServer())
        .post(`/universities/partners`)
        .set('Authorization', `Bearer ${keycloakUser.sub}`)
        .send({
          admissionStart: '2021-12-31',
          admissionEnd: '2021-01-01',
          openServiceDate: '2022-01-01',
          closeServiceDate: '2024-12-31',
          name: 'University of Oxford',
          timezone: 'Europe/London',
          website: 'https://www.ox.ac.uk/',
          codes: [],
          domains: [],
          countryId: country.id,
        })
        .expect(201);
    });*/

  it('should return all universities', async () => {
    countryRepository.init([country]);

    const university = universityFactory.makeOne();
    repository.init([university]);

    const response = await request(app.getHttpServer())
      .get('/universities')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(200);

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: university.id,
          name: university.name,
          sites: university.campus,
          timezone: university.timezone,
        }),
      ]),
    );
  });

  it('should return university by id', async () => {
    countryRepository.init([country]);

    const university = universityFactory.makeOne();
    repository.init([university]);

    await request(app.getHttpServer())
      .get(`/universities/${university.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(200);
  });

  it('should delete university', async () => {
    const central = universityFactory.makeOne();
    const partner = universityFactory.makeOne({
      parent: central.id,
    });

    userRepositoy.init([]);
    countryRepository.init([country]);
    learningLanguageRepository.init([]);
    repository.init([central, partner]);

    await request(app.getHttpServer())
      .delete(`/universities/${partner.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(200);
  });

  it('should return bad request if university has partners', async () => {
    countryRepository.init([country]);

    const central = universityFactory.makeOne();
    const partner = universityFactory.makeOne({
      parent: central.id,
    });
    repository.init([central, partner]);

    await request(app.getHttpServer())
      .delete(`/universities/${central.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(400);
  });

  it('should return bad request if university has users', async () => {
    countryRepository.init([country]);

    userRepositoy.init([user]);
    repository.init([university]);

    await request(app.getHttpServer())
      .delete(`/universities/${university.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(400);
  });

  it('should return bad request if university is central', async () => {
    languageRepository.init(languages);

    const central = universityFactory.makeOne();
    repository.init([central]);

    await request(app.getHttpServer())
      .delete(`/universities/${central.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(400);
  });
});
