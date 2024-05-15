import { LogLevel } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    validateSync,
} from 'class-validator';

export class Env {
    @IsString()
    @IsNotEmpty()
    ADMIN_URL: string;

    @IsString()
    @IsNotEmpty()
    API_URL: string;

    @IsString()
    @IsNotEmpty()
    APP_URL: string;

    @IsEnum(['error', 'warn', 'log', 'debug', 'verbose'])
    @IsOptional()
    LOG_LEVEL?: string;

    @IsString()
    @IsNotEmpty()
    DATABASE_URL: string;

    @IsString()
    @IsNotEmpty()
    KEYCLOAK_BASE_URL: string;

    @IsString()
    @IsNotEmpty()
    KEYCLOAK_REALM: string;

    @IsString()
    @IsNotEmpty()
    KEYCLOAK_ADMIN: string;

    @IsString()
    @IsNotEmpty()
    KEYCLOAK_ADMIN_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    KEYCLOAK_CLIENT_ID: string;

    @IsString()
    @IsNotEmpty()
    KEYCLOAK_CLIENT_SECRET: string;

    @IsString()
    @IsNotEmpty()
    S3_URL: string;

    @IsString()
    @IsNotEmpty()
    S3_REGION: string;

    @IsString()
    @IsNotEmpty()
    S3_ACCESS_KEY: string;

    @IsString()
    @IsNotEmpty()
    S3_ACCESS_SECRET: string;

    @IsString()
    @IsOptional()
    SENTRY_DSN?: string;

    static validate(configuration: Record<string, unknown>): Env {
        const env = plainToClass(Env, configuration, {
            enableImplicitConversion: false,
        });

        if (process.env.NODE_ENV === 'test') {
            return test;
        }

        const errors = validateSync(env, { skipMissingProperties: false });

        if (errors.length > 0) {
            throw new Error(errors.toString());
        }

        return env;
    }
}

export const getLoggerLevels = (logLevel: string): LogLevel[] => {
    const level: LogLevel[] = [];
    switch (logLevel) {
        case 'verbose':
            level.push('verbose');
        case 'debug':
            level.push('debug');
        case 'warn':
            level.push('warn');
        case 'error':
            level.push('error');
        case 'log':
            level.push('log');
            break;
        default:
            break;
    }
    return level;
};

/// Testing configuration
const test: Env = {
    ADMIN_URL: 'http://localhost:3000',
    APP_URL: 'http://localhost:4200',
    API_URL: 'http://localhost:3000',
    LOG_LEVEL: 'error',
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/test',
    KEYCLOAK_BASE_URL: 'http://localhost:8080/auth',
    KEYCLOAK_REALM: 'master',
    KEYCLOAK_ADMIN: 'admin',
    KEYCLOAK_ADMIN_PASSWORD: 'admin',
    KEYCLOAK_CLIENT_ID: 'admin-cli',
    KEYCLOAK_CLIENT_SECRET: 'f0a0c0e0-0000-0000-0000-000000000000',
    S3_URL: 'http://minio:9000',
    S3_REGION: 'eu-east-1',
    S3_ACCESS_KEY: 'minio',
    S3_ACCESS_SECRET: 'minio123',
};
