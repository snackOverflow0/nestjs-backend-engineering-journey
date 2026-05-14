import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(
    name: string,
    email: string,
    password: string) {
    return this.prisma.user.create({
      data: {
        name,
        email, 
        password
      }
    })
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
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

}
