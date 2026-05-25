import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/cache/redis.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService
  ) {}

  async create(
    dto: CreateProductDto,
    userId: number
  ) {
    const product = 
      await this.prisma.product.create({
        data: {
          ...dto,
          userId
        }
      })

    await this.redisService.del(
      'products'
    )

    return product
  }

  async findAll() {
    const cachedProducts = 
      await this.redisService.get(
        'products'
      )

    if (cachedProducts) {
      console.log(
        'FROM REDIS'
      )

      return JSON.parse(cachedProducts)
    } 

    console.log(
      'FROM DATABASE'
    )

    const products = 
      await this.prisma.product.findMany({
        include: {
          user: true
        }
      })

    await this.redisService.set(
      'products',
      products,
      60
    )

    return products
  }

  async findOne(id: number) {
    const cacheKey =
      `product:${id}`

    const cachedProduct = 
      await this.redisService.get(
        cacheKey
      )

    if (cachedProduct) {
      console.log(
        'SINGLE PRODUCT FROM REDIS'
      )

      return JSON.parse(
        cachedProduct
      )
    }

    console.log(
      'SINGLE PRODUCT FROM DATABASE'
    )

    const product = 
      await this.prisma.product.findUnique({
        where: { id },

        include: {
          user: true
        }
      })

    await this.redisService.set(
      cacheKey,
      product,
      60
    )

    return product
  }

  async update(
    id: number,
    dto: UpdateProductDto
  ) {
    await this.findOne(id)

    await this.redisService.del(
      'products'
    )

    await this.redisService.del(
      `product:${id}`
    )

    return this.prisma.product.update({
      where: { id },

      data: dto
    })
    
  }

  async remove(id: number) {
    await this.findOne(id)

    await this.redisService.del(
    'products',
    );

    await this.redisService.del(
      `product:${id}`,
    );

    return this.prisma.product.delete({
      where: { id },
    })
  }
}
