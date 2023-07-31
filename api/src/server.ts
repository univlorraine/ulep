import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainErrorFilter, PrismaClientExceptionFilter } from './api/filters';
import { CollectionInterceptor } from './api/interceptors';

export class Server {
  #port: number;

  constructor(port: number) {
    this.#port = port;
  }

  public async run(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    this.addGlobalPipes(app);
    this.addGlobalFilters(app);
    this.addGlobalInterceptors(app);
    this.addCORSConfiguration(app);
    this.buildAPIDocumentation(app);

    await app.listen(this.#port);
  }

  private addGlobalPipes(app: NestExpressApplication): void {
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
  }

  private addGlobalFilters(app: NestExpressApplication): void {
    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    app.useGlobalFilters(new DomainErrorFilter(httpAdapter));
  }

  private addGlobalInterceptors(app: NestExpressApplication): void {
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        strategy: 'excludeAll',
        groups: ['read'],
      }),
    );

    app.useGlobalInterceptors(new CollectionInterceptor());
  }

  private addCORSConfiguration(app: NestExpressApplication): void {
    app.enableCors({
      allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
      exposedHeaders: ['Content-Range'],
      origin: '*',
      methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
    });
  }

  private buildAPIDocumentation(app: NestExpressApplication): void {
    const options = new DocumentBuilder()
      .setTitle('ULEP API')
      .setVersion('1.0.0')
      // .addBearerAuth({ ... })
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document);
  }
}
