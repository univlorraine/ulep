import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  KeycloakUserFactory,
  LanguageFactory,
  UniversityFactory,
} from '@app/common';
import { TestServer } from './test.server';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { AUTHENTICATOR, InMemoryAuthenticator } from 'src/api/services';
import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';
import { USER_REPOSITORY } from 'src/core/ports/user.repository';
import { InMemoryUniversityRepository } from 'src/providers/persistance/repositories/in-memory-university-repository';
import { UNIVERSITY_REPOSITORY } from 'src/core/ports/university.repository';
import { AuthenticationGuard } from 'src/api/guards';
import { TestAuthGuard } from '../utils/TestAuthGuard';

describe('Universities', () => {
  let app: TestServer;

  const userRepositoy = new InMemoryUserRepository();
  const { user, keycloakUser } = new KeycloakUserFactory().makeOne();
  const authenticator = new InMemoryAuthenticator(keycloakUser);

  const languageFactory = new LanguageFactory();
  const languages = [
    languageFactory.makeOne({ code: 'en', name: 'English' }),
    languageFactory.makeOne({ code: 'fr', name: 'French' }),
  ];
  const languageRepository = new InMemoryLanguageRepository();

  const universityFactory = new UniversityFactory();
  const repository = new InMemoryUniversityRepository();

  beforeAll(async () => {
    userRepositoy.init([user]);

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UNIVERSITY_REPOSITORY)
      .useValue(repository)
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(languageRepository)
      .overrideProvider(USER_REPOSITORY)
      .useValue(userRepositoy)
      .overrideGuard(AuthenticationGuard)
      .useValue(TestAuthGuard)
      .overrideProvider(AUTHENTICATOR)
      .useValue(authenticator)
      .compile();

    app = TestServer.create(module.createNestApplication());
    await app.run();
  });

  beforeEach(() => {
    repository.reset();
    languageRepository.reset();
  });

  afterAll(async () => {
    await app.teardown();
  });

  it('should create university', async () => {
    languageRepository.init(languages);

    await request(app.getHttpServer())
      .post('/universities')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        id: '4be22c64-e341-4199-9175-1c43fdce3eed',
        name: 'University of Oxford',
        campusNames: ['Oxford'],
        timezone: 'Europe/London',
        languages: ['en', 'fr'],
        admissionStart: '2021-01-01',
        admissionEnd: '2021-12-31',
        website: 'https://www.ox.ac.uk/',
      })
      .expect(201);
  });

  it('should return bad request if university central already exists', async () => {
    languageRepository.init(languages);

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
        website: 'https://www.ox.ac.uk/',
      })
      .expect(400);
  });

  it('should return bad request if admission start date is after admission end date', async () => {
    languageRepository.init(languages);

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
        website: 'https://www.ox.ac.uk/',
      })
      .expect(400);
  });

  it('should create partner university', async () => {
    languageRepository.init(languages);

    const university = universityFactory.makeOne();
    repository.init([university]);

    await request(app.getHttpServer())
      .post(`/universities/${university.id}/partners`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        name: 'University of Oxford',
        timezone: 'Europe/London',
        website: 'https://www.ox.ac.uk/',
      })
      .expect(201);
  });

  it('partner should inherit languages and dates', async () => {
    languageRepository.init(languages);

    const university = universityFactory.makeOne();
    repository.init([university]);

    await request(app.getHttpServer())
      .post(`/universities/${university.id}/partners`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        name: 'University of Oxford',
        timezone: 'Europe/London',
        website: 'https://www.ox.ac.uk/',
      })
      .expect(201);

    const universities = await repository.findAll();
    const universityCreated = universities.items.find(
      (u) => u.id !== university.id,
    );

    expect(universityCreated.admissionStart).toEqual(university.admissionStart);
    expect(universityCreated.admissionEnd).toEqual(university.admissionEnd);
  });

  it('should return all universities', async () => {
    languageRepository.init(languages);

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
    languageRepository.init(languages);

    const university = universityFactory.makeOne();
    repository.init([university]);

    await request(app.getHttpServer())
      .get(`/universities/${university.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(200);
  });

  it('should delete university', async () => {
    languageRepository.init(languages);

    const central = universityFactory.makeOne();
    const partner = universityFactory.makeOne({
      parent: central.id,
    });
    repository.init([central, partner]);

    await request(app.getHttpServer())
      .delete(`/universities/${partner.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(200);
  });

  it('should return bad request if university has partners', async () => {
    languageRepository.init(languages);

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
