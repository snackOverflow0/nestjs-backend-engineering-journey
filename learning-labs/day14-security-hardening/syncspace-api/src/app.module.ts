import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, TasksModule, CacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
