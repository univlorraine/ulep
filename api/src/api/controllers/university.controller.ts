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
  SerializeOptions,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { PaginationDto } from '../dtos/pagination.dto';
import { GetUniversitiesUsecase } from '../../core/usecases/universities/get-universities.usecase';
import { Collection } from '../../shared/types/collection';
import { DeleteUniversityUsecase } from '../../core/usecases/universities/delete-university.usecase';
import { GetUniversityUsecase } from '../../core/usecases/universities/get-university.usecase';
import { CreateUniversityUsecase } from '../../core/usecases/universities/create-university.usecase';
import { CollectionResponse } from '../decorators/collection.decorator';
import {
  CreateUniversityRequest,
  UniversityResponse,
} from '../dtos/university';

@Controller('universities')
@Swagger.ApiTags('Universities')
export class UniversityController {
  private readonly logger = new Logger(UniversityController.name);

  constructor(
    private readonly getUniversityUsecase: GetUniversityUsecase,
    private readonly getUniversitiesUsecase: GetUniversitiesUsecase,
    private readonly createUniversityUsecase: CreateUniversityUsecase,
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

    return new Collection<UniversityResponse>({
      items: result.items.map(UniversityResponse.fromDomain),
      totalItems: result.totalItems,
    });
  }

  @Get(':id')
  @SerializeOptions({ groups: ['read', 'university:read'] })
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
  @SerializeOptions({ groups: ['read', 'university:read'] })
  @Swagger.ApiOperation({ summary: 'Creates a University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityResponse })
  async create(
    @Body() body: CreateUniversityRequest,
  ): Promise<UniversityResponse> {
    const instance = await this.createUniversityUsecase.execute(body);

    return UniversityResponse.fromDomain(instance);
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Deletes a University ressource.' })
  @Swagger.ApiOkResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    // TODO: throw exception if university is related to a profile
    await this.deleteUniversityUsecase.execute({ id });
  }
}
