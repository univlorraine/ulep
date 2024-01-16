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
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Role, Roles } from '../decorators/roles.decorator';
import { AuthenticationGuard } from '../guards';
import {
  CreateCampusUsecase,
  DeleteCampusUsecase,
  GetCampusByIdUsecase,
  GetCampusUsecase,
  UpdateCampusUsecase,
} from 'src/core/usecases/campus';
import {
  CampusResponse,
  CreateCampusRequest,
  UpdateCampusRequest,
} from 'src/api/dtos/campus';
@Controller('campus')
@Swagger.ApiTags('Campus')
export class CampusController {
  constructor(
    private readonly getCampusUsecase: GetCampusUsecase,
    private readonly getCampusByIdUsecase: GetCampusByIdUsecase,
    private readonly createCampusUsecase: CreateCampusUsecase,
    private readonly updateCampusUsecase: UpdateCampusUsecase,
    private readonly deleteCampusUsecase: DeleteCampusUsecase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Campus ressource.' })
  @Swagger.ApiCreatedResponse({ type: CampusResponse })
  async create(@Body() body: CreateCampusRequest) {
    const campus = await this.createCampusUsecase.execute(body);

    return CampusResponse.fromCampus(campus);
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Get a Campus ressource.' })
  @Swagger.ApiOkResponse({ type: CampusResponse, isArray: true })
  async findCampusById(@Param('id', ParseUUIDPipe) id: string) {
    const campus = await this.getCampusByIdUsecase.execute({ id });

    return CampusResponse.fromCampus(campus);
  }

  @Get()
  @Swagger.ApiOperation({ summary: 'Collection of Campus ressource.' })
  @Swagger.ApiOkResponse({ type: CampusResponse, isArray: true })
  async findCampus() {
    const campus = await this.getCampusUsecase.execute();

    return new Collection<CampusResponse>({
      items: campus.items.map(CampusResponse.fromCampus),
      totalItems: campus.totalItems,
    });
  }

  @Put()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Campus ressource.' })
  @Swagger.ApiOkResponse()
  async update(@Body() request: UpdateCampusRequest) {
    const campus = await this.updateCampusUsecase.execute({
      ...request,
    });

    return CampusResponse.fromCampus(campus);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Campus ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.deleteCampusUsecase.execute({ id });
  }
}
