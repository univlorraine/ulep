import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { KeycloakUser } from '@app/keycloak';
import { MediaObjectResponse } from '../dtos';
import { UploadAvatarUsecase } from 'src/core/usecases/media';
import { CurrentUser } from '../decorators';
import { AuthenticationGuard } from '../guards';

@Controller('uploads')
@Swagger.ApiTags('Uploads')
export class UploadsController {
  constructor(private readonly uploadAvatarUsecase: UploadAvatarUsecase) {}

  // TODO: post avatar with user's resource
  @Post('avatar')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Swagger.ApiOperation({ summary: 'Upload image' })
  @Swagger.ApiOkResponse({ type: MediaObjectResponse })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: KeycloakUser,
  ): Promise<MediaObjectResponse> {
    const upload = await this.uploadAvatarUsecase.execute({
      userId: user.sub,
      file,
    });

    return MediaObjectResponse.fromMediaObject(upload);
  }
}
