import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UploadModule } from 'src/upload/upload.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/upload/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, UploadModule, CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
