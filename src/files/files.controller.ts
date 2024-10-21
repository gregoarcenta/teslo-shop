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
import { ApiTags } from '@nestjs/swagger';
import { Auth, Role } from '../auth/decorators';
import {
  ApiUploadResponse,
  ApiGetImageResponse,
  ApiDeleteFileResponse,
} from '../documentation/decorators/files';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @Auth(Role.Admin)
  @UseInterceptors(
    FileInterceptor('file', {
      // storage: diskStorage({destination:"./static/products"})
    }),
  )
  @ApiUploadResponse()
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
    return this.filesService.uploadFile(file);
  }

  @Get('product/:imageName')
  @ApiGetImageResponse()
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const url = await this.filesService.getFile(imageName);
    res.redirect(url);
  }

  @Delete('product/:id')
  @Auth(Role.Admin)
  @ApiDeleteFileResponse()
  deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
}
