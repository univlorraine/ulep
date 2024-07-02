import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT, RedisClient } from './redis-client.type';
import { ConfigService } from '@nestjs/config';

export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
    provide: REDIS_CLIENT,
    useFactory: async (configuration: ConfigService) => {
        const client = createClient({
            url: configuration.get<string>('REDIS_URL'),
        });
        await client.connect();
        return client;
    },
    inject: [ConfigService],
};
