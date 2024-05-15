import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { Env } from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: Env.validate,
        }),
        ApiModule,
    ],
})
export class AppModule {}
