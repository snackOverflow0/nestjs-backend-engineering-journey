import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService
  ) {}

  create(
    dto: CreateProductDto,
    userId: number
  ) {
    return this.prisma.product.create({
      data: {
        ...dto,
        userId
      }
    })
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })
  }

  async findOne(id: number) {
    const product =
      await this.prisma.product.findUnique({
        where: { id },

        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      })

    if (!product) {
      throw new NotFoundException(
        'Product not found'
      )
    }

    return product
  }

  async update(
    id: number,
    dto: UpdateProductDto
  ) {
    await this.findOne(id)

    return this.prisma.product.update({
      where: { id },

      data: dto
    })
    
  }

  async remove(id: number) {
    await this.findOne(id)

    return this.prisma.product.delete({
      where: { id },
    })
  }
}
