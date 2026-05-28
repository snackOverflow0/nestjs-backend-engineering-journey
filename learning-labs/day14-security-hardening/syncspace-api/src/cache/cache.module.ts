import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { RedisService } from './redis.service';

@Module({
  controllers: [CacheController],
  providers: [
    CacheService,
    RedisService
  ],
  exports: [RedisService]
})
export class CacheModule {}
