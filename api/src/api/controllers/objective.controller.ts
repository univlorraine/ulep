import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { ObjectiveResponse, CreateObjectiveRequest } from '../dtos/objective';
import {
  CreateObjectiveUsecase,
  DeleteObjectiveUsecase,
  FindAllObjectiveUsecase,
  FindOneObjectiveUsecase,
} from '../../core/usecases/objective';

@Controller('objectives')
@Swagger.ApiTags('Objectives')
export class ObjectiveController {
  private readonly logger = new Logger(ObjectiveController.name);

  constructor(
    private readonly createObjectiveUsecase: CreateObjectiveUsecase,
    private readonly findAllObjectiveUsecase: FindAllObjectiveUsecase,
    private readonly findOneObjectiveUsecase: FindOneObjectiveUsecase,
    private readonly deleteObjectiveUsecase: DeleteObjectiveUsecase,
  ) {}

  @Post()
  @Swagger.ApiOperation({ summary: 'Create a new Objective ressource.' })
  @Swagger.ApiCreatedResponse({ type: ObjectiveResponse })
  async create(@Body() body: CreateObjectiveRequest) {
    const instance = await this.createObjectiveUsecase.execute(body);

    return ObjectiveResponse.fromDomain(instance);
  }

  @Get()
  @Swagger.ApiOperation({ summary: 'Collection of Objective ressource.' })
  @Swagger.ApiOkResponse({ type: ObjectiveResponse, isArray: true })
  async findAll() {
    const instances = await this.findAllObjectiveUsecase.execute();

    return instances.map(ObjectiveResponse.fromDomain);
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Objective ressource.' })
  @Swagger.ApiOkResponse({ type: ObjectiveResponse })
  async findOne(@Param('id') id: string) {
    const instance = await this.findOneObjectiveUsecase.execute(id);

    return ObjectiveResponse.fromDomain(instance);
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Deletes a Objective ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.deleteObjectiveUsecase.execute({ id });
  }
}
