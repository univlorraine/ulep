import { KeycloakUser } from '@app/keycloak';
import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { Env } from 'src/configuration';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import {
  GetMediaObjectUsecase,
  UploadAvatarUsecase,
} from 'src/core/usecases/media';
import { CurrentUser } from '../decorators';
import { MEDIA_READ, MediaObjectResponse } from '../dtos';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators/images.validator';

@Controller('uploads')
@Swagger.ApiTags('Uploads')
export class UploadsController {
  // Expiration time for presigned url
  #expirationTime: number;

  constructor(
    @Inject(STORAGE_INTERFACE) private readonly storage: StorageInterface,
    private readonly uploadAvatarUsecase: UploadAvatarUsecase,
    private readonly getMediaObjectUsecase: GetMediaObjectUsecase,
    env: ConfigService<Env, true>,
  ) {
    this.#expirationTime = env.get('SIGNED_URL_EXPIRATION_IN_SECONDS');
  }

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

    const url = await this.storage.temporaryUrl(
      upload.bucket,
      upload.name,
      this.#expirationTime,
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
  async findOne(@Param('id') id: string): Promise<MediaObjectResponse | null> {
    const now = new Date().getTime();
    const instance = await this.getMediaObjectUsecase.execute({ id });

    const url = instance
      ? await this.storage.temporaryUrl(
          instance.bucket,
          instance.name,
          this.#expirationTime,
        )
      : undefined;

    return url
      ? new MediaObjectResponse({
          id: instance.id,
          mimeType: instance.mimetype,
          url,
          name: instance.name,
          expireAt: new Date(now + this.#expirationTime * 1000),
        })
      : null;
  }
}
