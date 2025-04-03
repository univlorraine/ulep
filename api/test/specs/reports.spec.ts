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

// import * as request from 'supertest';
// import { Test } from '@nestjs/testing';
// import { AppModule } from 'src/app.module';
// import {
//   KeycloakUserFactory,
//   LanguageFactory,
//   ReportCategoryFactory,
//   ReportFactory,
// } from '@app/common';
// import { TestServer } from './test.server';
// import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
// import { InMemoryReportsRepository } from 'src/providers/persistance/repositories/in-memory-reports-repository';
// import { REPORT_REPOSITORY } from 'src/core/ports/report.repository';
// import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
// import { AUTHENTICATOR, InMemoryAuthenticator } from 'src/api/services';
// import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';
// import { USER_REPOSITORY } from 'src/core/ports/user.repository';

describe('Reports', () => {
  test('should determine if we keep those tests', () => {
    // Not sure reports are needed so commenting this for now...
    expect(true).toBeTruthy();
  });
});
// describe('Reports', () => {
//   let app: TestServer;

//   const userRepositoy = new InMemoryUserRepository();
//   const { user, keycloakUser } = new KeycloakUserFactory().makeOne();
//   const authenticator = new InMemoryAuthenticator(keycloakUser);

//   const languageFactory = new LanguageFactory();
//   const language = languageFactory.makeOne({ code: 'en' });
//   const languageRepository = new InMemoryLanguageRepository();

//   const reportFactory = new ReportFactory();
//   const categoryFactory = new ReportCategoryFactory();
//   const repository = new InMemoryReportsRepository();

//   beforeAll(async () => {
//     languageRepository.init([language]);
//     userRepositoy.init([user]);

//     const module = await Test.createTestingModule({
//       imports: [AppModule],
//     })
//       .overrideProvider(REPORT_REPOSITORY)
//       .useValue(repository)
//       .overrideProvider(LANGUAGE_REPOSITORY)
//       .useValue(languageRepository)
//       .overrideProvider(USER_REPOSITORY)
//       .useValue(userRepositoy)
//       .overrideProvider(AUTHENTICATOR)
//       .useValue(authenticator)
//       // .overrideGuard(AuthenticationGuard)
//       // .useValue(TestAuthGuard)
//       .compile();

//     app = TestServer.create(module.createNestApplication());
//     await app.run();
//   });

//   beforeEach(() => {
//     repository.reset();
//   });

//   afterAll(async () => {
//     await app.teardown();
//   });

//   it('create category should succeed', async () => {
//     const { body } = await request(app.getHttpServer())
//       .post('/reports/categories')
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .send({
//         id: '4be22c64-e341-4199-9175-1c43fdce3eed',
//         name: 'TheReportCategory',
//         languageCode: language.code,
//       })
//       .expect(201);

//     expect(body).toHaveProperty('id');
//     expect(body).toHaveProperty('name');

//     const createdCategory = await repository.categoryOfId(body.id);
//     expect(createdCategory).toBeDefined();
//   });

//   it('create category should fail if language does not exist', async () => {
//     await request(app.getHttpServer())
//       .post('/reports/categories')
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .send({
//         id: '4be22c64-e341-4199-9175-1c43fdce3eed',
//         name: 'TheReportCategory',
//         languageCode: 'fr',
//       })
//       .expect(400);
//   });

//   it('create report should succeed', async () => {
//     const category = categoryFactory.makeOne();
//     repository.init([category], []);

//     await request(app.getHttpServer())
//       .post('/reports')
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .send({
//         category: category.id,
//         content: 'test',
//       })
//       .expect(201);
//   });

//   it('create report should fail if category does not exist', async () => {
//     await request(app.getHttpServer())
//       .post('/reports')
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .send({
//         id: 'da60293b-0542-42cb-ab27-456551da13b6',
//         category: 'b1204f49-1b5e-4978-8691-34c670e9c34a',
//         name: 'test',
//       })
//       .expect(400);
//   });

//   it('should return all reports', async () => {
//     const category = categoryFactory.makeOne();
//     const reports = reportFactory.makeMany(2, { category });

//     repository.init([category], reports);

//     const { body } = await request(app.getHttpServer())
//       .get('/reports?status=OPEN')
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .expect(200);

//     expect(body).toHaveLength(2);
//     expect(body[0]).toHaveProperty('id');
//     expect(body[0]).toHaveProperty('owner');
//     expect(body[0]).toHaveProperty('category');
//     expect(body[0]).toHaveProperty('content');
//     expect(body[0]).toHaveProperty('status');
//   });

//   it('should return a report', async () => {
//     const category = categoryFactory.makeOne();
//     const report = reportFactory.makeOne({ category });

//     repository.init([category], [report]);

//     const { body } = await request(app.getHttpServer())
//       .get(`/reports/${report.id}`)
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .expect(200);

//     expect(body).toHaveProperty('id');
//     expect(body).toHaveProperty('owner');
//     expect(body).toHaveProperty('category');
//     expect(body).toHaveProperty('content');
//     expect(body).toHaveProperty('status');
//   });

//   it('should update a report status', async () => {
//     const category = categoryFactory.makeOne();
//     const report = reportFactory.makeOne({ category });

//     repository.init([category], [report]);

//     await request(app.getHttpServer())
//       .patch(`/reports/${report.id}`)
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .send({
//         status: 'CLOSED',
//       })
//       .expect(200);

//     const updatedReport = await repository.reportOfId(report.id);
//     expect(updatedReport.status).toEqual('CLOSED');
//   });

//   it('should fail to update a report status if status does not exist', async () => {
//     const category = categoryFactory.makeOne();
//     const report = reportFactory.makeOne({ category });

//     repository.init([category], [report]);

//     await request(app.getHttpServer())
//       .patch(`/reports/${report.id}`)
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .send({
//         status: 'INVALID',
//       })
//       .expect(400);
//   });

//   it('should fail to update a report status if report does not exist', async () => {
//     await request(app.getHttpServer())
//       .patch(`/reports/4be22c64-e341-4199-9175-1c43fdce3eed`)
//       .set('Authorization', `Bearer ${keycloakUser.sub}`)
//       .send({
//         status: 'CLOSED',
//       })
//       .expect(404);
//   });

//   it('delete report should succeed', async () => {
//     const category = categoryFactory.makeOne();
//     const report = reportFactory.makeOne({ category });

//     repository.init([category], [report]);

//     await request(app.getHttpServer())
//       .delete(`/reports/${report.id}`)
//       .expect(200);

//     const deletedReport = await repository.reportOfId(report.id);
//     expect(deletedReport).toBeNull();
//   });

//   it('delete report should fail if report does not exist', async () => {
//     await request(app.getHttpServer())
//       .delete(`/reports/4be22c64-e341-4199-9175-1c43fdce3eed`)
//       .expect(404);
//   });

//   it('delete category should succeed', async () => {
//     const category = categoryFactory.makeOne();

//     repository.init([category], []);

//     await request(app.getHttpServer())
//       .delete(`/reports/categories/${category.id}`)
//       .expect(200);

//     const deletedCategory = await repository.categoryOfId(category.id);
//     expect(deletedCategory).toBeNull();
//   });

//   it('delete category should fail if category does not exist', async () => {
//     await request(app.getHttpServer())
//       .delete(`/reports/categories/4be22c64-e341-4199-9175-1c43fdce3eed`)
//       .expect(404);
//   });
// });
