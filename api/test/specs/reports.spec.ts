import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  KeycloakUserFactory,
  LanguageFactory,
  ReportCategoryFactory,
  ReportFactory,
} from '@app/common';
import { TestServer } from './test.server';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryReportsRepository } from 'src/providers/persistance/repositories/in-memory-reports-repository';
import { REPORT_REPOSITORY } from 'src/core/ports/report.repository';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { AUTHENTICATOR, InMemoryAuthenticator } from 'src/api/services';
import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';
import { USER_REPOSITORY } from 'src/core/ports/user.repository';

describe('Reports', () => {
  let app: TestServer;

  const userRepositoy = new InMemoryUserRepository();
  const { user, keycloakUser } = new KeycloakUserFactory().makeOne();
  const authenticator = new InMemoryAuthenticator(keycloakUser);

  const languageFactory = new LanguageFactory();
  const language = languageFactory.makeOne({ code: 'en' });
  const languageRepository = new InMemoryLanguageRepository();

  const reportFactory = new ReportFactory();
  const categoryFactory = new ReportCategoryFactory();
  const repository = new InMemoryReportsRepository();

  beforeAll(async () => {
    languageRepository.init([language]);
    userRepositoy.init([user]);

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(REPORT_REPOSITORY)
      .useValue(repository)
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(languageRepository)
      .overrideProvider(USER_REPOSITORY)
      .useValue(userRepositoy)
      .overrideProvider(AUTHENTICATOR)
      .useValue(authenticator)
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

  it('create category should succeed', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/reports/categories')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        id: '4be22c64-e341-4199-9175-1c43fdce3eed',
        name: 'TheReportCategory',
        languageCode: language.code,
      })
      .expect(201);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');

    const createdCategory = await repository.categoryOfId(body.id);
    expect(createdCategory).toBeDefined();
  });

  it('create category should fail if language does not exist', async () => {
    await request(app.getHttpServer())
      .post('/reports/categories')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        id: '4be22c64-e341-4199-9175-1c43fdce3eed',
        name: 'TheReportCategory',
        languageCode: 'fr',
      })
      .expect(400);
  });

  it('create report should succeed', async () => {
    const category = categoryFactory.makeOne();
    repository.init([category], []);

    await request(app.getHttpServer())
      .post('/reports')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        id: '4be22c64-e341-4199-9175-1c43fdce3eed',
        category: category.id,
        content: 'test',
      })
      .expect(201);
  });

  it('create report should fail if category does not exist', async () => {
    await request(app.getHttpServer())
      .post('/reports')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        id: 'da60293b-0542-42cb-ab27-456551da13b6',
        category: 'b1204f49-1b5e-4978-8691-34c670e9c34a',
        name: 'test',
      })
      .expect(400);
  });

  it('should return all reports', async () => {
    const category = categoryFactory.makeOne();
    const reports = reportFactory.makeMany(2, { category });

    repository.init([category], reports);

    const { body } = await request(app.getHttpServer())
      .get('/reports?status=OPEN')
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(200);

    expect(body).toHaveLength(2);
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('owner');
    expect(body[0]).toHaveProperty('category');
    expect(body[0]).toHaveProperty('content');
    expect(body[0]).toHaveProperty('status');
  });

  it('should return a report', async () => {
    const category = categoryFactory.makeOne();
    const report = reportFactory.makeOne({ category });

    repository.init([category], [report]);

    const { body } = await request(app.getHttpServer())
      .get(`/reports/${report.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .expect(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('owner');
    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('content');
    expect(body).toHaveProperty('status');
  });

  it('should update a report status', async () => {
    const category = categoryFactory.makeOne();
    const report = reportFactory.makeOne({ category });

    repository.init([category], [report]);

    await request(app.getHttpServer())
      .patch(`/reports/${report.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        status: 'CLOSED',
      })
      .expect(200);

    const updatedReport = await repository.reportOfId(report.id);
    expect(updatedReport.status).toEqual('CLOSED');
  });

  it('should fail to update a report status if status does not exist', async () => {
    const category = categoryFactory.makeOne();
    const report = reportFactory.makeOne({ category });

    repository.init([category], [report]);

    await request(app.getHttpServer())
      .patch(`/reports/${report.id}`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        status: 'INVALID',
      })
      .expect(400);
  });

  it('should fail to update a report status if report does not exist', async () => {
    await request(app.getHttpServer())
      .patch(`/reports/4be22c64-e341-4199-9175-1c43fdce3eed`)
      .set('Authorization', `Bearer ${keycloakUser.sub}`)
      .send({
        status: 'CLOSED',
      })
      .expect(404);
  });

  it('delete report should succeed', async () => {
    const category = categoryFactory.makeOne();
    const report = reportFactory.makeOne({ category });

    repository.init([category], [report]);

    await request(app.getHttpServer())
      .delete(`/reports/${report.id}`)
      .expect(200);

    const deletedReport = await repository.reportOfId(report.id);
    expect(deletedReport).toBeNull();
  });

  it('delete report should fail if report does not exist', async () => {
    await request(app.getHttpServer())
      .delete(`/reports/4be22c64-e341-4199-9175-1c43fdce3eed`)
      .expect(404);
  });

  it('delete category should succeed', async () => {
    const category = categoryFactory.makeOne();

    repository.init([category], []);

    await request(app.getHttpServer())
      .delete(`/reports/categories/${category.id}`)
      .expect(200);

    const deletedCategory = await repository.categoryOfId(category.id);
    expect(deletedCategory).toBeNull();
  });

  it('delete category should fail if category does not exist', async () => {
    await request(app.getHttpServer())
      .delete(`/reports/categories/4be22c64-e341-4199-9175-1c43fdce3eed`)
      .expect(404);
  });
});
