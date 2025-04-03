/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
