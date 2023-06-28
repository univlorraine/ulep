/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
  Query,
  Logger,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { UpdateUniversityUsecase } from '../../core/usecases/universities/update-university.usecase';
import { PaginationDto } from '../dtos/pagination.dto';
import { GetUniversitiesUsecase } from '../../core/usecases/universities/get-universities.usecase';
import { Collection } from '../../shared/types/collection';
import { DeleteUniversityUsecase } from '../../core/usecases/universities/delete-university.usecase';
import { GetUniversityUsecase } from '../../core/usecases/universities/get-university.usecase';
import { CreateUniversityUsecase } from '../../core/usecases/universities/create-university.usecase';
import { UniversityResponse } from '../dtos/university/university.response';
import { CreateUniversityRequest } from '../dtos/university/create-university.request';
import { UpdateUniversityRequest } from '../dtos/university/update-university.request';
import { CollectionResponse } from '../decorators/collection.decorator';

@Controller('universities')
@Swagger.ApiTags('Universities')
export class UniversityController {
  private readonly logger = new Logger(UniversityController.name);

  constructor(
    private readonly getUniversityUsecase: GetUniversityUsecase,
    private readonly getUniversitiesUsecase: GetUniversitiesUsecase,
    private readonly createUniversityUsecase: CreateUniversityUsecase,
    private readonly updateUniversityUsecase: UpdateUniversityUsecase,
    private readonly deleteUniversityUsecase: DeleteUniversityUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of University ressource.',
  })
  @CollectionResponse(UniversityResponse)
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<UniversityResponse>> {
    const result = await this.getUniversitiesUsecase.execute({ page, limit });

    return new Collection<UniversityResponse>(
      result.items.map(UniversityResponse.fromDomain),
      result.totalItems,
    );
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Retrieve a University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UniversityResponse> {
    const instance = await this.getUniversityUsecase.execute({ id });

    return UniversityResponse.fromDomain(instance);
  }

  @Post()
  @Swagger.ApiOperation({ summary: 'Creates a University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async create(
    @Body() body: CreateUniversityRequest,
  ): Promise<UniversityResponse> {
    const instance = await this.createUniversityUsecase.execute(body);

    return UniversityResponse.fromDomain(instance);
  }

  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUniversityRequest,
  ): Promise<UniversityResponse> {
    const instance = await this.updateUniversityUsecase.execute({
      id,
      name: body.name,
      admissionStart: body.admissionStart,
      admissionEnd: body.admissionEnd,
    });

    return UniversityResponse.fromDomain(instance);
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Deletes a University ressource.' })
  @Swagger.ApiOkResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUniversityUsecase.execute({ id });
  }
}
