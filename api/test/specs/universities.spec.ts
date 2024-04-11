import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  CountryFactory,
  I18nService,
  KeycloakUserFactory,
  LanguageFactory,
  UniversityFactory,
  UserFactory,
} from '@app/common';
import { TestServer } from './test.server';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { AUTHENTICATOR, InMemoryAuthenticator } from 'src/api/services';
import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';
import { USER_REPOSITORY } from 'src/core/ports/user.repository';
import { InMemoryUniversityRepository } from 'src/providers/persistance/repositories/in-memory-university-repository';
import { UNIVERSITY_REPOSITORY } from 'src/core/ports/university.repository';
import { AuthenticationGuard } from 'src/api/guards';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { InMemoryCountryCodesRepository } from 'src/providers/persistance/repositories/in-memory-country-repository';
import { COUNTRY_REPOSITORY } from 'src/core/ports/country.repository';
import { Language, LanguageStatus, PairingMode } from 'src/core/models';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import { LEARNING_LANGUAGE_REPOSITORY } from 'src/core/ports/learning-language.repository';
import { InMemoryLearningLanguageRepository } from 'src/providers/persistance/repositories/in-memory-learning-language-repository';
import { KeycloakClient } from '@app/keycloak';
import { InMemoryI18nService } from 'src/providers/services/in-memory.i18n.provider';
import { faker } from '@faker-js/faker';
import { LANGUAGE_REPOSITORY } from '../../src/core/ports/language.repository';

describe('Universities', () => {
  let app: TestServer;

  const userRepositoy = new InMemoryUserRepository();
  const countryRepository = new InMemoryCountryCodesRepository();
  const universityFactory = new UniversityFactory();
  const university = universityFactory.makeOne();
  const userFactory = new UserFactory();
  const user = userFactory.makeOne({ university });
  const { keycloakUser } = new KeycloakUserFactory().makeOne({ user });
  const authenticator = new InMemoryAuthenticator(keycloakUser);
  const learningLanguageRepository = new InMemoryLearningLanguageRepository();
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
  const inMemoryI18n = new InMemoryI18nService();

  beforeAll(async () => {
    userRepositoy.init([user]);
    countryRepository.init([country]);
    languageRepository.init(languages);

    const keycloak = new KeycloakClient({
      realm: 'test',
      username: 'test',
      password: 'password',
      clientId: 'test',
      clientSecret: 'secret',
      baseUrl: 'http://localhost:8080/auth',
      adminGroupId: 'admin',
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
      .overrideProvider(KeycloakClient)
      .useValue(keycloak)
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
