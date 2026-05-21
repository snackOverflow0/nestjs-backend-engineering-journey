import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) {}

  findByEmail(email: string){
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  createUser(
    email: string,
    password: string
  ) {
    return this.prisma.user.create({
      data: {
        email,
        password
      }
    })
  }

  updateRefreshToken(
    userId: number,
    hashedRefreshToken: string | null 
  ) {
    return this.prisma.user.update({
      where: { 
        id: userId
       },

      data: {
        hashedRefreshToken
      }
    })
  }
}
