import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  create(
    email: string,
    password: string,
    name?: string
  ) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        name
      }
    })
  }

  findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })
  }

  findUserByEmail(
    email: string
  ) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  findById(
    id: number
  ) {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }
}
