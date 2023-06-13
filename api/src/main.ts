import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './shared/errors/prisma-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import { CollectionInterceptor } from 'src/api/interceptor/CollectionInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuration = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const swagger = new DocumentBuilder()
    .setTitle('eTandems API')
    .setDescription('The eTandems API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('docs', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new CollectionInterceptor());
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
    exposedHeaders: ['Content-Range'],
    origin: [process.env.ADMIN_URL],
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
  });

  await app.listen(configuration.get('port'));
}
bootstrap();
