import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './shared/errors/prisma-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import { CollectionInterceptor } from 'src/api/interceptors/collection.interceptor';
import { DomainErrorFilter } from './api/interceptors/domain-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuration = app.get(ConfigService);

  const swagger = new DocumentBuilder()
    .setTitle('eTandems API')
    .setDescription('The eTandems API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('docs', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  // Pipes
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  // Filters
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new DomainErrorFilter(httpAdapter));
  // Interceptors
  app.useGlobalInterceptors(new CollectionInterceptor());
  // CORS
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
    exposedHeaders: ['Content-Range'],
    origin: [process.env.ADMIN_URL],
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
  });

  await app.listen(configuration.get('port'));
}
bootstrap();
