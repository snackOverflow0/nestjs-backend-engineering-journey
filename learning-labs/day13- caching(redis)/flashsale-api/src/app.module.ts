import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CacheModule } from './cache/cache.module';
import { ProductsModule } from './products/products.module';
import { FlashSaleModule } from './flash-sale/flash-sale.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ProductsModule, CacheModule, FlashSaleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
