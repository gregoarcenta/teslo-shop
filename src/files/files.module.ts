import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  controllers: [FilesController],
  providers: [
    FilesService,
    CloudinaryService,
    CloudinaryProvider.cloudinaryConfig(),
  ],
})
export class FilesModule {}
