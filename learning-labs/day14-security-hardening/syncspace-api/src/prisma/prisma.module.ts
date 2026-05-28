import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()

@Module({
  providers: [PrismaService],

  // Export allows other modules
  // to use PrismaService
  exports: [PrismaService],
})

export class PrismaModule {}