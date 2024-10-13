import {
  Controller,
  Delete,
  Param,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      // storage: diskStorage({destination:"./static/products"})
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg|jpg|png|gif' }),
          new MaxFileSizeValidator({ maxSize: 250000 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // console.log({ file });
    return this.filesService.uploadFile(file);
  }

  @Get('product/:publicId')
  async getImage(@Param('publicId') publicId: string, @Res() res: Response) {
    const url = await this.filesService.getFile(publicId);
    res.redirect(url);
  }

  @Delete('product/:id')
  deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
}
