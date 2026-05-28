import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()

// This service connects NestJS to Prisma
export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  
  // Runs automatically when app starts
  async onModuleInit() {

    // Connect to PostgreSQL
    await this.$connect();

    console.log('Database Connected');
  }
}