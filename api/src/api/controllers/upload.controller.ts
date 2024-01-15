import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Inject,
  SerializeOptions,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { KeycloakUser } from '@app/keycloak';
import { MEDIA_READ, MediaObjectResponse } from '../dtos';
import {
  GetMediaObjectUsecase,
  UploadAvatarUsecase,
} from 'src/core/usecases/media';
import { CurrentUser } from '../decorators';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators/images.validator';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';

@Controller('uploads')
@Swagger.ApiTags('Uploads')
export class UploadsController {
  // Default expiration time for presigned url is 1h
  private readonly EXPIRATION_TIME = 3600;

  constructor(
    @Inject(STORAGE_INTERFACE) private readonly storage: StorageInterface,
    private readonly uploadAvatarUsecase: UploadAvatarUsecase,
    private readonly getMediaObjectUsecase: GetMediaObjectUsecase,
  ) {}

  @Post('avatar')
  @SerializeOptions({ groups: ['read', 'media:read'] })
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Swagger.ApiOperation({ summary: 'Upload image' })
  @Swagger.ApiOkResponse({ type: MediaObjectResponse })
  async uploadFile(
    @UploadedFile(new ImagesFilePipe()) file: Express.Multer.File,
    @CurrentUser() user: KeycloakUser,
  ): Promise<MediaObjectResponse> {
    const upload = await this.uploadAvatarUsecase.execute({
      userId: user.sub,
      file,
    });

    const url = await this.storage.generatePresignedUrl(
      upload.bucket,
      upload.name,
      this.EXPIRATION_TIME,
    );

    return new MediaObjectResponse({
      id: upload.id,
      mimeType: upload.mimetype,
      url,
    });
  }

  @Get(':id')
  @SerializeOptions({ groups: ['read', MEDIA_READ] })
  @Swagger.ApiOperation({ summary: 'MediaObject ressource' })
  @Swagger.ApiResponse({ type: MediaObjectResponse })
  async findOne(@Param('id') id: string): Promise<MediaObjectResponse> {
    const instance = await this.getMediaObjectUsecase.execute({ id });

    const url = await this.storage.generatePresignedUrl(
      instance.bucket,
      instance.name,
      this.EXPIRATION_TIME,
    );

    return new MediaObjectResponse({
      id: instance.id,
      mimeType: instance.mimetype,
      url,
    });
  }
}
