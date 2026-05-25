import { Module } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import { FlashSaleController } from './flash-sale.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [FlashSaleController],
  providers: [FlashSaleService],
})
export class FlashSaleModule {}
