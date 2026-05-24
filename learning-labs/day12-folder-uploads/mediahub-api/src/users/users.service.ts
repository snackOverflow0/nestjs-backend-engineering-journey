import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) {}

  async updateAvatar(
    userId: number,
    avatarUrl: string
  ) {
    return this.prisma.user.update({
      where: {
        id: userId
      },

      data: {
        avatar: avatarUrl
      }
    })
  }
}
