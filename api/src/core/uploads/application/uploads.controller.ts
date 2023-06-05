import {
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadImageUsecase } from '../usecases/upload-image.usecase';

@Controller('uploads')
@ApiTags('Uploads')
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(private readonly uploadImageUsecase: UploadImageUsecase) {}

  @Post('images')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload image' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.uploadImageUsecase.execute(file);
    return;
  }
}
