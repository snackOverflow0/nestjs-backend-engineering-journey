import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisService } from 'src/cache/redis.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
