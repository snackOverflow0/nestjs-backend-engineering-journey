import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) {}

  create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto
    })
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

}
