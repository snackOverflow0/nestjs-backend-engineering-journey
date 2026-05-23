import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor }
from '@nestjs/platform-express';

import { UploadService }
from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    private uploadService:
      UploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize:
          5 * 1024 * 1024,
      },
    })
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const result =
      await this.uploadService
        .uploadImage(file);

    return {
      imageUrl:
        result.secure_url,
    };
  }
}