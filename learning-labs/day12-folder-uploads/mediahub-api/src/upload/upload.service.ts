import {
  Injectable,
  Inject,
} from '@nestjs/common';

import { Multer } from 'multer';
@Injectable()

export class UploadService {
  constructor(
    @Inject('CLOUDINARY')
    private cloudinary,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
  ) {
    return new Promise<any>(
      (resolve, reject) => {
        this.cloudinary.uploader
          .upload_stream(
            {
              folder:
                'mediahub',
            },

            (error, result) => {
              if (error) {
                return reject(error);
              }

              resolve(result);
            },
          )

          .end(file.buffer);
      },
    );
  }
}