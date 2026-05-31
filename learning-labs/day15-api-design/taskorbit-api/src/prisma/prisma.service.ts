import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Automatically connect to PostgreSQL when the backend starts up
  async onModuleInit() {
    await this.$connect();
  }

  // Cleanly close the database connection when the backend shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }
}