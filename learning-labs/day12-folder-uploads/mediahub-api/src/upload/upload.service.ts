import { Injectable }
from '@nestjs/common';

import cloudinary from './cloudinary/cloudinary';

import { Multer } from 'multer';
@Injectable()
export class UploadService {
  async uploadImage(
    file: Express.Multer.File,
  ) {
    return new Promise<any>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'mediahub',
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