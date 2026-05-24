import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UploadService } from 'src/upload/upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Getuser } from 'src/auth/decorators/get-user.decorator';
import { multerOptions } from 'src/upload/multer/multer.config';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadService: UploadService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerOptions
    )
  ) 

  async createPost(
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Getuser() user: any
  ){
    const result =  
      await this.uploadService.uploadImage(file)

    return this.postsService.createPost(
      dto,
      result.secure_url,
      user.sub
    )
  }

  
}
