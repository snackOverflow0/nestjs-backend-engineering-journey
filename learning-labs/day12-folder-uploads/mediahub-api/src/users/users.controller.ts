import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Getuser } from 'src/auth/decorators/get-user.decorator';
import { UploadService } from 'src/upload/upload.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('file')
  ) 

  async uploadAvatar(
    @UploadedFile()
    file: Express.Multer.File,

    @Getuser()
    user: any
  ) {
    const result = 
      await this.uploadService
          .uploadImage(file)

    return this.usersService
               .updateAvatar(
                  user.sub,
                  result.secure_url
                )
  }
}
