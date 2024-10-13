import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ public_id: string; format: string }> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve({ public_id: result.public_id, format: result.format });
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async getImageUrl(publicId: string) {
    try {
      const { secure_url } = await cloudinary.api.resource(publicId);
      return secure_url;
    } catch (error) {
      throw error;
    }
  }

  deleteImage(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return cloudinary.uploader.destroy(
        id,
        { invalidate: true },
        (error, result) => {
          if (error) return reject(error);

          // { result: 'ok' }
          // { result: 'not found' }
          if (result.result === 'not found')
            return reject(new NotFoundException('Image not found'));

          resolve(result);
        },
      );
    });
  }
}
