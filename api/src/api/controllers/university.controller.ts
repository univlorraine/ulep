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
