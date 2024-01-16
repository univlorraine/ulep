import * as Sentry from '@sentry/node';
import {
  ClassSerializerInterceptor,
  INestApplication,
  LogLevel,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainErrorFilter, PrismaClientExceptionFilter } from './api/filters';
import {
  CollectionInterceptor,
  HttpLoggerInterceptor,
} from './api/interceptors';
import { SentryFilter } from './api/filters/sentry-exception.filter';
import { Env } from './configuration';

export class Server {
  public async run(port: number): Promise<INestApplication> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: this.getLogLevelsUpTo(
        (process.env.LOG_LEVEL ?? Env.DEFAULT_LOG_LEVEL) as LogLevel,
      ),
    });

    this.addGlobalPipes(app);
    this.addGlobalFilters(app);
    this.addGlobalInterceptors(app);
    this.addCORSConfiguration(app);

    if (process.env.NODE_ENV !== 'production') {
      this.buildAPIDocumentation(app);
    }

    await app.listen(port);

    return app;
  }

  protected addGlobalPipes(app: INestApplication): void {
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
  }

  protected addGlobalFilters(app: INestApplication): void {
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    app.useGlobalFilters(new DomainErrorFilter(httpAdapter));

    if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_DSN) {
      Sentry.init({ dsn: process.env.SENTRY_DSN });
      app.useGlobalFilters(new SentryFilter(httpAdapter));
    }
  }

  protected addGlobalInterceptors(app: INestApplication): void {
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        strategy: 'excludeAll',
        groups: ['read'],
      }),
    );

    app.useGlobalInterceptors(new HttpLoggerInterceptor());

    app.useGlobalInterceptors(new CollectionInterceptor());
  }

  protected addCORSConfiguration(app: INestApplication): void {
    app.enableCors({
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Range',
        'Language-code',
      ],
      exposedHeaders: ['Content-Range'],
      origin: '*',
      methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
    });
  }

  protected buildAPIDocumentation(app: INestApplication): void {
    const options = new DocumentBuilder()
      .setTitle('ULEP API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document);
  }

  protected getLogLevelsUpTo(level: LogLevel): LogLevel[] {
    const levels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];
    const index = levels.indexOf(level);
    if (index === -1) {
      throw new Error(`Niveau de log inconnu : ${level}`);
    }

    return levels.slice(0, index + 1);
  }
}
