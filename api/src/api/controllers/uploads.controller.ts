import {
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { UploadImageUsecase } from '../../core/usecases/uploads/upload-image.usecase';
import { User } from '../decorators/user.decorator';
import { KeycloakUserInfoResponse } from '@app/keycloak';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { UploadResponse } from '../dtos/media/upload.response';

@Controller('uploads')
@Swagger.ApiTags('Uploads')
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(private readonly uploadImageUsecase: UploadImageUsecase) {}

  @Post('images')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Swagger.ApiOperation({ summary: 'Upload image' })
  @Swagger.ApiOkResponse({ type: UploadResponse })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: KeycloakUserInfoResponse,
  ): Promise<UploadResponse> {
    const upload = await this.uploadImageUsecase.execute({
      profileId: user.sub,
      file,
    });

    return new UploadResponse({
      id: upload.id,
      url: `${process.env.MINIO_PUBLIC_URL}/${upload.bucket}/${upload.name}`,
    });
  }
}
