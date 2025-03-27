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
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  SerializeOptions,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { UniversityKeycloakInterceptor } from 'src/api/interceptors';
import { ImagesFilePipe } from 'src/api/validators';
import { University } from 'src/core/models';
import {
  GetInstanceUsecase,
  UploadUniversityImageUsecase,
} from 'src/core/usecases';
import { UploadUniversityDefaultCertificateUsecase } from 'src/core/usecases/media/upload-university-default-certificate.usecase';
import {
  CreatePartnerUniversityUsecase,
  CreateUniversityUsecase,
  DeleteUniversityUsecase,
  GetPartnersToUniversityUsecase,
  GetUniversitiesUsecase,
  GetUniversityDivisionsUsecase,
  GetUniversityUsecase,
  UpdateUniversityUsecase,
} from '../../core/usecases/university';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  CreateUniversityPartnerRequest,
  CreateUniversityRequest,
  LanguageResponse,
  UniversityResponse,
  UpdateUniversityRequest,
} from '../dtos';
import { GetUniversitiesRequest } from '../dtos/universities/get-universities.request';
import { AuthenticationGuard } from '../guards';

@Controller('universities')
@Swagger.ApiTags('Universities')
export class UniversityController {
  constructor(
    private readonly createUniversityUsecase: CreateUniversityUsecase,
    private readonly createPartnerUniversityUsecase: CreatePartnerUniversityUsecase,
    private readonly getUniversityUsecase: GetUniversityUsecase,
    private readonly getPartnersToUniversity: GetPartnersToUniversityUsecase,
    private readonly getUniversitiesUsecase: GetUniversitiesUsecase,
    private readonly updateUniversityUsecase: UpdateUniversityUsecase,
    private readonly deleteUniversityUsecase: DeleteUniversityUsecase,
    private readonly uploadUniversityImageUsecase: UploadUniversityImageUsecase,
    private readonly uploadUniversityDefaultCertificateUsecase: UploadUniversityDefaultCertificateUsecase,
    private readonly getInstanceUsecase: GetInstanceUsecase,
    private readonly getUniversityDivisionsUsecase: GetUniversityDivisionsUsecase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(FileInterceptor('defaultCertificateFile'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new University ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async create(
    @Body() body: CreateUniversityRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let university: University =
      await this.createUniversityUsecase.execute(body);

    if (file) {
      const upload = await this.uploadUniversityImageUsecase.execute({
        id: university.id,
        file,
      });
      university = new University({ ...university, logo: upload });
    }

    return UniversityResponse.fromUniversity(university);
  }

  @Post('partners')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiOperation({
    summary: 'Create a new partner University ressource.',
  })
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async createPartnerUniversity(
    @Body() body: CreateUniversityPartnerRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let university: University =
      await this.createPartnerUniversityUsecase.execute(body);

    if (file) {
      const upload = await this.uploadUniversityImageUsecase.execute({
        id: university.id,
        file,
      });
      university = new University({ ...university, logo: upload });
    }

    return UniversityResponse.fromUniversity(university);
  }

  @Get()
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({ summary: 'Collection of University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse, isArray: true })
  async getUniversities(@Query() query: GetUniversitiesRequest) {
    const universities = await this.getUniversitiesUsecase.execute({
      orderBy: {
        field: query.field,
        order: query.order,
      },
    });

    return new Collection({
      items: universities.items.map((university) =>
        UniversityResponse.fromUniversity(university),
      ),
      totalItems: universities.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(UniversityKeycloakInterceptor)
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({ summary: 'University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const university = await this.getUniversityUsecase.execute(id);
    const instance = await this.getInstanceUsecase.execute();

    return UniversityResponse.fromUniversity(university, instance);
  }

  @Get(':id/partners')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Swagger.ApiOperation({
    summary: 'Get all the partner universities for an university.',
  })
  @Swagger.ApiOkResponse({ type: UniversityResponse })
  async findPartners(@Param('id', ParseUUIDPipe) id: string) {
    const universities = await this.getPartnersToUniversity.execute(id);

    return universities;
  }

  @Get(':id/languages')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({
    summary: 'Get the specifics languages of a university.',
  })
  @Swagger.ApiOkResponse({ type: LanguageResponse, isArray: true })
  async getLanguages(@Param('id', ParseUUIDPipe) id: string) {
    const university = await this.getUniversityUsecase.execute(id);

    return university.specificLanguagesAvailable.map(
      LanguageResponse.fromLanguage,
    );
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'defaultCertificateFile', maxCount: 1 },
    ]),
  )
  @UseInterceptors(UniversityKeycloakInterceptor)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates an University ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiOkResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateUniversityRequest,
    @UploadedFiles()
    files: {
      file: Express.Multer.File[];
      defaultCertificateFile: Express.Multer.File[];
    },
  ) {
    let university: University = await this.updateUniversityUsecase.execute({
      id,
      ...request,
    });

    if (files.file) {
      const upload = await this.uploadUniversityImageUsecase.execute({
        id: university.id,
        file: files.file[0],
      });

      university = new University({ ...university, logo: upload });
    }

    if (files.defaultCertificateFile) {
      await this.uploadUniversityDefaultCertificateUsecase.execute({
        id: university.id,
        file: files.defaultCertificateFile[0],
      });
    }

    return UniversityResponse.fromUniversity(university);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a University ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.deleteUniversityUsecase.execute({ id });
  }

  @Get(':id/divisions')
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({ summary: 'Collection of University divisions.' })
  @Swagger.ApiOkResponse({ type: String, isArray: true })
  async getUniversityDivisions(@Param('id') id: string) {
    return await this.getUniversityDivisionsUsecase.execute(id);
  }
}
