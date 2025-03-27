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

import { Collection } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { Edito } from 'src/core/models/edito.model';
import {
  GenerateEditosUsecase,
  GetEditoByUniversityIdUsecase,
  GetEditoUsecase,
  UpdateEditoUsecase,
  UploadEditoImageUsecase,
} from 'src/core/usecases';
import { GetEditosUsecase } from 'src/core/usecases/edito/get-editos.usecase';
import { Role, Roles } from '../decorators/roles.decorator';
import { EditoResponse } from '../dtos/editos/edito.response';
import { UpdateEditoRequest } from '../dtos/editos/update-edito.request';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators';

@ApiTags('Editos')
@Controller('editos')
export class EditoController {
  constructor(
    private readonly generateEditosUsecase: GenerateEditosUsecase,
    private readonly getEditosUsecase: GetEditosUsecase,
    private readonly getEditoUsecase: GetEditoUsecase,
    private readonly getEditoByUniversityIdUsecase: GetEditoByUniversityIdUsecase,
    private readonly updateEditoUsecase: UpdateEditoUsecase,
    private readonly uploadEditoImageUsecase: UploadEditoImageUsecase,
  ) {}

  @Post('/generate')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Create an Edito resource.' })
  @Swagger.ApiOkResponse({ type: EditoResponse })
  async generateEditos() {
    await this.generateEditosUsecase.execute();
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Get all Editos.' })
  @Swagger.ApiOkResponse({ type: Collection<EditoResponse> })
  async getEditos() {
    const editos = await this.getEditosUsecase.execute();

    return new Collection<EditoResponse>({
      items: editos.map((edito) => EditoResponse.fromDomain(edito)),
      totalItems: editos.length,
    });
  }

  @Get('university/:id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Swagger.ApiOperation({ summary: 'Get an Edito resource by university id.' })
  @Swagger.ApiOkResponse({ type: EditoResponse })
  async getEditoByUniversityId(
    @Param('id') id: string,
    @Headers('Language-code') languageCode?: string,
  ) {
    const edito = await this.getEditoByUniversityIdUsecase.execute(id);

    return EditoResponse.fromDomain(edito, languageCode);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Swagger.ApiOperation({ summary: 'Get an Edito resource.' })
  @Swagger.ApiOkResponse({ type: EditoResponse })
  async getEdito(@Param('id') id: string) {
    const edito = await this.getEditoUsecase.execute(id);

    return EditoResponse.fromDomain(edito);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Update an Edito resource.' })
  @Swagger.ApiOkResponse({ type: EditoResponse })
  @UseInterceptors(FileInterceptor('file'))
  async updateEdito(
    @Param('id') id: string,
    @Body() body: UpdateEditoRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let edito = await this.updateEditoUsecase.execute({ id, ...body });

    if (file) {
      const uploadURL = await this.uploadEditoImageUsecase.execute({
        id: edito.id,
        file,
      });

      edito = new Edito({ ...edito, imageURL: uploadURL });
    }

    return EditoResponse.fromDomain(edito);
  }
}
