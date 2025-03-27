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
    SentryInterceptor,
} from 'src/api/interceptors';
import { RedisIoAdapter } from '@app/common';

export class Server {
    public async run(port: number): Promise<INestApplication> {
        const app = await NestFactory.create<NestExpressApplication>(
            AppModule,
            {},
        );

        this.addGlobalPipes(app);
        this.addGlobalInterceptors(app);
        this.addCORSConfiguration(app);
        await this.buildWebSocketAdapter(app);

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

        if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_DSN) {
            console.info('Sentry interceptor enabled');
            app.useGlobalInterceptors(new SentryInterceptor());
        }

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

    protected async buildWebSocketAdapter(
        app: INestApplication,
    ): Promise<void> {
        const redisIoAdapter = new RedisIoAdapter(app);
        await redisIoAdapter.connectToRedis(process.env.REDIS_URL);
        app.useWebSocketAdapter(redisIoAdapter);
    }
}
