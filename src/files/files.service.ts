import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      const response = await this.cloudinaryService.uploadImage(file);
      return response;
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException('Cannot upload file');
    }
  }

  async getFile(imageName: string) {
    const publicId = imageName.split('.')[0];
    try {
      return await this.cloudinaryService.getImageUrl(publicId);
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }

  async deleteFile(id: string) {
    try {
      await this.cloudinaryService.deleteImage(id);
      return `The image with the id: ${id} was removed`;
    } catch (e) {
      if (!!e.response) return e.response;

      this.logger.error(e.message);
      throw new BadRequestException("The image couldn't be deleted.");
    }
  }
}
