import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { I18nService, LanguageFactory } from '@app/common';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { TestServer } from './test.server';
import { AuthenticationGuard } from 'src/api/guards';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import { InMemoryI18nService } from 'src/providers/services/in-memory.i18n.provider';
import InMemoryNotificaitonGateway from 'src/providers/gateway/in-memory-notification.gateway';
import { NOTIFICATION_GATEWAY } from 'src/core/ports/notification.gateway';

describe('Languages', () => {
  let app: TestServer;

  const factory = new LanguageFactory();
  const repository = new InMemoryLanguageRepository();
  const inMemoryEmail = new InMemoryEmailGateway();
  const inMemoryNotification = new InMemoryNotificaitonGateway();
  const inMemoryI18n = new InMemoryI18nService();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LANGUAGE_REPOSITORY)
      .useValue(repository)
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

  test('GetCollection', async () => {
    const languages = factory.makeMany(10);
    repository.init(languages);

    const { body } = await request(app.getHttpServer())
      .get('/languages')
      .expect(200);

    expect(body.items).toHaveLength(10);
  });
});
