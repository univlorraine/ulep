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

import { I18nService } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { InstanceResponse } from 'src/api/dtos/instance/instance.response';
import { UpdateInstanceRequest } from 'src/api/dtos/instance/update-instance.request';
import { Env } from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import { GetInstanceUsecase, UpdateInstanceUsecase } from 'src/core/usecases';
import { UploadInstanceDefaultCertificateUsecase } from 'src/core/usecases/media/upload-instance-default-certificate.usecase';

@Controller('instance')
@Swagger.ApiTags('Instance')
export class InstanceController {
  private readonly logger = new Logger(InstanceController.name);

  constructor(
    private readonly getInstanceUsecase: GetInstanceUsecase,
    private readonly updateInstanceUsecase: UpdateInstanceUsecase,
    private readonly uploadInstanceDefaultCertificateUsecase: UploadInstanceDefaultCertificateUsecase,
    private readonly env: ConfigService<Env, true>,
    private readonly i18n: I18nService,
  ) {}

  @Get('config')
  @Swagger.ApiOperation({ summary: 'Get the instance configuration' })
  @Swagger.ApiCreatedResponse({ type: InstanceResponse })
  async getInstance(): Promise<InstanceResponse> {
    const instance = await this.getInstanceUsecase.execute();

    return InstanceResponse.fromDomain(instance);
  }

  @Put()
  @UseInterceptors(FileInterceptor('defaultCertificateFile'))
  @Swagger.ApiOperation({ summary: 'Update the instance' })
  @Swagger.ApiCreatedResponse({ type: InstanceResponse })
  async updateInstance(
    @Body() body: UpdateInstanceRequest,
    @UploadedFile() defaultCertificateFile: Express.Multer.File,
  ): Promise<InstanceResponse> {
    const instance = await this.updateInstanceUsecase.execute(body);

    if (defaultCertificateFile) {
      await this.uploadInstanceDefaultCertificateUsecase.execute({
        file: defaultCertificateFile,
      });
    }

    return InstanceResponse.fromDomain(instance);
  }

  @Get('locales/:lng/translation')
  async locales(@Param('lng') lng: string): Promise<string> {
    const appNamespace =
      this.env.get('APP_TRANSLATION_NAMESPACE') || 'translation';

    if (this.i18n.hasLanguageBundle(lng, appNamespace)) {
      const res = this.i18n.getLanguageBundle(lng, appNamespace);
      return JSON.stringify(res);
    }

    throw new RessourceDoesNotExist();
  }
}
