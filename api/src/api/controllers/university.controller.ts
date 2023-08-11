import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  UniversityResponse,
  CreateUniversityRequest,
  UpdateUniversityNameRequest,
  AddUniversityLanguageRequest,
  LanguageResponse,
  UpdateUniversityPartnerRequest,
} from '../dtos';
import {
  CreateUniversityUsecase,
  CreatePartnerUniversityUsecase,
  AddLanguageUsecase,
  DeleteUniversityUsecase,
  GetUniversityUsecase,
  GetUniversitiesUsecase,
  GetLanguagesUsecase,
  UpdateUniversityNameUsecase,
  DeleteLanguageUsecase,
} from '../../core/usecases/university';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { AuthenticationGuard } from '../guards';
import { Collection } from '@app/common';

// TODO: languages add/remove
@Controller('universities')
@Swagger.ApiTags('Universities')
export class UniversityController {
  constructor(
    private readonly createUniversityUsecase: CreateUniversityUsecase,
    private readonly createPartnerUniversityUsecase: CreatePartnerUniversityUsecase,
    private readonly addLanguageUsecase: AddLanguageUsecase,
    private readonly getUniversityUsecase: GetUniversityUsecase,
    private readonly getUniversitiesUsecase: GetUniversitiesUsecase,
    private readonly getLanguagesUsecase: GetLanguagesUsecase,
    private readonly updateUniversityNameUsecase: UpdateUniversityNameUsecase,
    private readonly deleteUniversityUsecase: DeleteUniversityUsecase,
    private readonly deleteLanguageUsecase: DeleteLanguageUsecase,
  ) {}

  @Post()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async create(@Body() body: CreateUniversityRequest) {
    const instance = await this.createUniversityUsecase.execute(body);

    return UniversityResponse.fromUniversity(instance);
  }

  @Post(':id/partners')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async createPartnerUniversity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUniversityPartnerRequest,
  ) {
    const instance = await this.createPartnerUniversityUsecase.execute({
      parent: id,
      ...body,
    });

    return UniversityResponse.fromUniversity(instance);
  }

  @Post(':id/languages')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Language ressource.' })
  @Swagger.ApiCreatedResponse({ type: LanguageResponse })
  async createLanguage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddUniversityLanguageRequest,
  ) {
    const instance = await this.addLanguageUsecase.execute({
      university: id,
      ...body,
    });

    return LanguageResponse.fromLanguage(instance);
  }

  @Get()
  @Swagger.ApiOperation({ summary: 'Collection of University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse, isArray: true })
  async findPartners() {
    const universities = await this.getUniversitiesUsecase.execute();

    return new Collection<UniversityResponse>({
      items: universities.items.map((university) =>
        UniversityResponse.fromUniversity(university),
      ),
      totalItems: universities.totalItems,
    });
  }

  @Get(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({ summary: 'University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getUniversityUsecase.execute(id);

    return UniversityResponse.fromUniversity(instance);
  }

  @Get(':id/languages')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Language ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse, isArray: true })
  async findLanguages(@Param('id', ParseUUIDPipe) id: string) {
    const instances = await this.getLanguagesUsecase.execute({
      university: id,
    });

    return instances.map(LanguageResponse.fromLanguage);
  }

  @Patch(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a University ressource.' })
  @Swagger.ApiOkResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateUniversityNameRequest,
  ) {
    await this.updateUniversityNameUsecase.execute({ id, ...request });
  }

  @Delete(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a University ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.deleteUniversityUsecase.execute({ id });
  }

  @Delete(':university/languages/:id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Language ressource.' })
  @Swagger.ApiOkResponse()
  removeLanguage(
    @Param('university', ParseUUIDPipe) university: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.deleteLanguageUsecase.execute({ id, university });
  }
}
