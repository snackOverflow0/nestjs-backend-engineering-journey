import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(
    dto: any,
    imageUrl: string,
    userId: number
  ) {
    return this.prisma.post.create({
      data: {
        content: dto.content,
        imageUrl,
        userId
      }
    })  
  }
}
