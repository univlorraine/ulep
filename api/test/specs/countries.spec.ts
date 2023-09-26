import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CountryFactory } from '@app/common';
import { COUNTRY_REPOSITORY } from 'src/core/ports/country.repository';
import { InMemoryCountryCodesRepository } from 'src/providers/persistance/repositories/in-memory-country-repository';
import { TestServer } from './test.server';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { AuthenticationGuard } from 'src/api/guards';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';

describe('Countries', () => {
  let app: TestServer;

  const factory = new CountryFactory();
  const repository = new InMemoryCountryCodesRepository();
  const inMemoryEmail = new InMemoryEmailGateway();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(COUNTRY_REPOSITORY)
      .useValue(repository)
      .overrideProvider(EMAIL_GATEWAY)
      .useValue(inMemoryEmail)
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
    expect(items).toHaveLength(30);
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
