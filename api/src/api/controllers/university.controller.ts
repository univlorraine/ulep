import { Collection } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { configuration } from 'src/configuration';
import {
  CreatePartnerUniversityUsecase,
  CreateUniversityUsecase,
  DeleteUniversityUsecase,
  GetUniversitiesUsecase,
  GetUniversityUsecase,
  UpdateUniversityNameUsecase,
} from '../../core/usecases/university';
import { Roles } from '../decorators/roles.decorator';
import {
  CreateUniversityPartnerRequest,
  CreateUniversityRequest,
  UniversityResponse,
  UpdateUniversityNameRequest,
} from '../dtos';
import { AuthenticationGuard } from '../guards';

// TODO: languages add/remove
@Controller('universities')
@Swagger.ApiTags('Universities')
export class UniversityController {
  constructor(
    private readonly createUniversityUsecase: CreateUniversityUsecase,
    private readonly createPartnerUniversityUsecase: CreatePartnerUniversityUsecase,
    private readonly getUniversityUsecase: GetUniversityUsecase,
    private readonly getUniversitiesUsecase: GetUniversitiesUsecase,
    private readonly updateUniversityNameUsecase: UpdateUniversityNameUsecase,
    private readonly deleteUniversityUsecase: DeleteUniversityUsecase,
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

  @Post('partners')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Create a new partner University ressource.',
  })
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async createPartnerUniversity(@Body() body: CreateUniversityPartnerRequest) {
    const university = await this.createPartnerUniversityUsecase.execute(body);

    return UniversityResponse.fromUniversity(university);
  }

  @Get()
  @Swagger.ApiOperation({ summary: 'Collection of University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse, isArray: true })
  async findPartners() {
    const universities = await this.getUniversitiesUsecase.execute();

    return new Collection<UniversityResponse>({
      items: universities.items.map(UniversityResponse.fromUniversity),
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
}
