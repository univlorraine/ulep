import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
    CollectionInterceptor,
    HttpLoggerInterceptor,
} from 'src/api/interceptors';

export class Server {
    public async run(port: number): Promise<INestApplication> {
        const app = await NestFactory.create<NestExpressApplication>(
            AppModule,
            {},
        );

        this.addGlobalPipes(app);
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
                'sentry-trace',
                'baggage',
            ],
            exposedHeaders: ['Content-Range'],
            origin: '*',
            methods: [
                'GET',
                'HEAD',
                'OPTIONS',
                'POST',
                'PUT',
                'PATCH',
                'DELETE',
            ],
        });
    }

    protected buildAPIDocumentation(app: INestApplication): void {
        const options = new DocumentBuilder()
            .setTitle('ULEP Chat')
            .setVersion('1.0.0')
            .addBearerAuth()
            .build();

        const document: OpenAPIObject = SwaggerModule.createDocument(
            app,
            options,
        );

        SwaggerModule.setup('docs', app, document);
    }
}
