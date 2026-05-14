import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],

  providers: [UsersService],
  controllers: [UsersController],

  exports: [UsersService]
})
export class UsersModule {}
