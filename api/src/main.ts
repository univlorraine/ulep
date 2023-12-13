import * as Sentry from '@sentry/node';
import { Server } from './server';
import { HttpAdapterHost } from '@nestjs/core';
import { SentryFilter } from './api/filters/sentry-exception.filter';

async function bootstrap(): Promise<void> {
  const server = new Server();
  const app = await server.run(3000);

  if (process.env.SENTRY_DNS) {
    Sentry.init({ dsn: process.env.SENTRY_DNS });
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new SentryFilter(httpAdapter));
  }
}

(async (): Promise<void> => {
  await bootstrap();
})();
