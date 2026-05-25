import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/cache/redis.service';

@Injectable()
export class FlashSaleService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService
  ) {}

  async buyProduct(
    userId: number,
    productId: number,
  ) {
    await this.checkRateLimit(userId)

    const redisKey =
      `stock:${productId}`;

    let stock =
      await this.redisService.get(
        redisKey,
      );

    if (!stock) {

      const product =
        await this.prisma.product.findUnique({
          where: {
            id: productId,
          },
        });

      if (!product) {
        throw new BadRequestException(
          'Product not found',
        );
      }

      stock = product.stock;

      await this.redisService.set(
        redisKey,
        stock,
      );
    }

    stock = Number(stock);

    if (stock <= 0) {
      throw new BadRequestException(
        'Out of stock',
      );
    }

    stock--;

    await this.redisService.set(
      redisKey,
      stock,
    );

    await this.redisService
      .zIncrBy(
        'leaderboard',
        1,
        userId.toString(),
      );

    await this.prisma.product.update({
      where: {
        id: productId,
      },

      data: {
        stock,
      },
    });

    return {
      message:
        'Purchase successful',

      remainingStock:
        stock,
    };
  }

  async checkRateLimit(
    userId: number,
  ) {

    const rateLimitKey =
      `rate-limit:${userId}`;

    let requestCount =
      await this.redisService.get(
        rateLimitKey,
      );

    requestCount =
      requestCount
        ? Number(requestCount)
        : 0;

    if (requestCount >= 5) {

      throw new BadRequestException(
        'Too many purchase attempts. Try again later.',
      );
    }

    requestCount++;

    await this.redisService.set(
      rateLimitKey,
      requestCount,
      60,
    );
  }

  async getLeaderboard() {

    const leaderboard =
      await this.redisService
        .zRevRange(
          'leaderboard',
          0,
          9,
        );

    return leaderboard;
  }
}
