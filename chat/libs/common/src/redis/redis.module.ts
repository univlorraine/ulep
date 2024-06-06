import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis-client.factory';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    providers: [redisClientFactory, RedisService],
    imports: [ConfigModule],
    exports: [RedisService],
})
export class RedisModule {}
