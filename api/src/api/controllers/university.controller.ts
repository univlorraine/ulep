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
  UpdateUniversityUsecase,
} from '../../core/usecases/university';
import { Roles } from '../decorators/roles.decorator';
import {
  CreateUniversityPartnerRequest,
  CreateUniversityRequest,
  UniversityResponse,
  UpdateUniversityRequest,
} from '../dtos';
import { AuthenticationGuard } from '../guards';
@Controller('universities')
@Swagger.ApiTags('Universities')
export class UniversityController {
  constructor(
    private readonly createUniversityUsecase: CreateUniversityUsecase,
    private readonly createPartnerUniversityUsecase: CreatePartnerUniversityUsecase,
    private readonly getUniversityUsecase: GetUniversityUsecase,
    private readonly getUniversitiesUsecase: GetUniversitiesUsecase,
    private readonly updateUniversityUsecase: UpdateUniversityUsecase,
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
  async getUniversities() {
    const universities = await this.getUniversitiesUsecase.execute();

    return new Collection<UniversityResponse>({
      items: universities.items.map(UniversityResponse.fromUniversity),
      totalItems: universities.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({ summary: 'University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getUniversityUsecase.execute(id);

    return UniversityResponse.fromUniversity(instance);
  }

  @Put(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a University ressource.' })
  @Swagger.ApiOkResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateUniversityRequest,
  ) {
    const university = await this.updateUniversityUsecase.execute({
      id,
      ...request,
    });

    return UniversityResponse.fromUniversity(university);
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
