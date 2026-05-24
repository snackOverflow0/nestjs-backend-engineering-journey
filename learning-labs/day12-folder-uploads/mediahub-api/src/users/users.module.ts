import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UploadModule } from 'src/upload/upload.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
