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
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  CreatePartnerUniversityUsecase,
  CreateUniversityUsecase,
  DeleteUniversityUsecase,
  GetPartnersToUniversityUsecase,
  GetUniversitiesUsecase,
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
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from 'src/api/validators';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadUniversityImageUsecase } from 'src/core/usecases';
import { University, UniversityWithKeycloakContact } from 'src/core/models';

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
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new University ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async create(
    @Body() body: CreateUniversityRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let university: UniversityWithKeycloakContact =
      await this.createUniversityUsecase.execute(body);

    if (file) {
      const upload = await this.uploadUniversityImageUsecase.execute({
        id: university.id,
        file,
      });
      university = new University({ ...university, logo: upload });
    }

    return UniversityResponse.fromUniversity(
      university,
      university.defaultContact,
    );
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
    let university: UniversityWithKeycloakContact =
      await this.createPartnerUniversityUsecase.execute(body);

    if (file) {
      const upload = await this.uploadUniversityImageUsecase.execute({
        id: university.id,
        file,
      });
      university = new University({ ...university, logo: upload });
    }

    return UniversityResponse.fromUniversity(
      university,
      university.defaultContact,
    );
  }

  @Get()
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({ summary: 'Collection of University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse, isArray: true })
  async getUniversities() {
    const universities = await this.getUniversitiesUsecase.execute();

    return new Collection({
      items: universities.items.map((university) =>
        UniversityResponse.fromUniversity(
          university,
          university.defaultContact,
        ),
      ),
      totalItems: universities.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({ summary: 'University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const university = await this.getUniversityUsecase.execute(id);

    return UniversityResponse.fromUniversity(
      university,
      university.defaultContact,
    );
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
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates an University ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiOkResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateUniversityRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let university: UniversityWithKeycloakContact =
      await this.updateUniversityUsecase.execute({
        id,
        ...request,
      });

    if (file) {
      const upload = await this.uploadUniversityImageUsecase.execute({
        id: university.id,
        file,
      });

      university = new University({ ...university, logo: upload });
    }

    return UniversityResponse.fromUniversity(
      university,
      university.defaultContact,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a University ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.deleteUniversityUsecase.execute({ id });
  }
}
