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

import { CountryFactory, I18nService } from '@app/common';
import { Test } from '@nestjs/testing';
import { AuthenticationGuard } from 'src/api/guards';
import { AppModule } from 'src/app.module';
import { COUNTRY_REPOSITORY } from 'src/core/ports/country.repository';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import { NOTIFICATION_GATEWAY } from 'src/core/ports/notification.gateway';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import InMemoryNotificaitonGateway from 'src/providers/gateway/in-memory-notification.gateway';
import { InMemoryCountryCodesRepository } from 'src/providers/persistance/repositories/in-memory-country-repository';
import { InMemoryI18nService } from 'src/providers/services/in-memory.i18n.provider';
import * as request from 'supertest';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { TestServer } from './test.server';

describe('Countries', () => {
  let app: TestServer;

  const factory = new CountryFactory();
  const repository = new InMemoryCountryCodesRepository();
  const inMemoryEmail = new InMemoryEmailGateway();
  const inMemoryNotification = new InMemoryNotificaitonGateway();
  const inMemoryI18n = new InMemoryI18nService();

  beforeAll(async () => {
    // Avoid jest timeout issues
    jest.useFakeTimers({ legacyFakeTimers: true });

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(COUNTRY_REPOSITORY)
      .useValue(repository)
      .overrideProvider(NOTIFICATION_GATEWAY)
      .useValue(inMemoryNotification)
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

  test('GetCollection with default pagination', async () => {
    const countries = factory.makeMany(100);
    repository.init(countries);

    const { body } = await request(app.getHttpServer())
      .get('/countries')
      .expect(200);

    const { items, totalItems } = body;
    expect(items).toHaveLength(50);
    expect(totalItems).toEqual(100);
  });

  // get collection with pagination
  test('GetCollection with pagination', async () => {
    const countries = factory.makeMany(100);
    repository.init(countries);

    const { body } = await request(app.getHttpServer())
      .get('/countries?page=2&limit=10')
      .expect(200);

    const { items, totalItems } = body;
    expect(items).toHaveLength(10);
    expect(totalItems).toEqual(100);
  });

  // get collection without pagination
  test('GetCollection without pagination', async () => {
    const countries = factory.makeMany(100);
    repository.init(countries);

    const { body } = await request(app.getHttpServer())
      .get('/countries?pagination=false')
      .expect(200);

    const { items, totalItems } = body;
    expect(items).toHaveLength(100);
    expect(totalItems).toEqual(100);
  });

  test('Schema', async () => {
    const country = factory.makeOne();
    repository.init([country]);

    const { body } = await request(app.getHttpServer())
      .get('/countries')
      .expect(200);

    const { items } = body;

    expect(items[0]).toHaveProperty('id');
    expect(items[0]).toHaveProperty('code');
    expect(items[0]).toHaveProperty('name');
    expect(items[0]).toHaveProperty('emoji');
    expect(items[0]).toHaveProperty('enable');
  });

  test('With filter', async () => {
    const availableCountries = factory.makeMany(4, { enable: true });
    const unvailableCountries = factory.makeMany(2, { enable: false });
    repository.init([...availableCountries, ...unvailableCountries]);

    const { body } = await request(app.getHttpServer())
      .get('/countries?enable=true')
      .expect(200);

    const { totalItems } = body;
    expect(totalItems).toEqual(availableCountries.length);
  });

  test('Patch status', async () => {
    const country = factory.makeOne({ enable: true });
    repository.init([country]);

    await request(app.getHttpServer())
      .patch(`/countries/${country.id}`)
      .send({ enable: false })
      .expect(200);

    const updatedCountry = await repository.ofId(country.id);
    expect(updatedCountry.enable).toBeFalsy();
  });
});
