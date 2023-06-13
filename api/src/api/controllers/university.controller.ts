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
import { UpdateUniversityUsecase } from 'src/core/usecases/universities/update-university.usecase';
import { PaginationDto } from '../dtos/pagination.dto';
import { GetUniversitiesUsecase } from 'src/core/usecases/universities/get-universities.usecase';
import { Collection } from 'src/shared/types/collection';
import { DeleteUniversityUsecase } from 'src/core/usecases/universities/delete-university.usecase';
import { GetUniversityUsecase } from 'src/core/usecases/universities/get-university.usecase';
import { University } from 'src/core/models/university';
import { CreateUniversityUsecase } from 'src/core/usecases/universities/create-university.usecase';
import { UniversityRead, UniversityWrite } from '../dtos/university.dto';

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
  @Swagger.ApiOkResponse({ type: UniversityRead, isArray: true })
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<UniversityRead>> {
    const result = await this.getUniversitiesUsecase.execute({ page, limit });

    return {
      items: result.items.map(UniversityRead.fromDomain),
      total: result.total,
    };
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Retrieve a University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityRead })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UniversityRead> {
    const instance = await this.getUniversityUsecase.execute({ id });

    return UniversityRead.fromDomain(instance);
  }

  @Post()
  @Swagger.ApiOperation({ summary: 'Creates a University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityRead })
  async create(@Body() body: UniversityWrite): Promise<UniversityRead> {
    const instance = await this.createUniversityUsecase.execute(body);

    return UniversityRead.fromDomain(instance);
  }

  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityRead })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UniversityWrite,
  ): Promise<UniversityRead> {
    const instance = await this.updateUniversityUsecase.execute({
      id,
      name: body.name,
    });

    return UniversityRead.fromDomain(instance);
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Deletes a University ressource.' })
  @Swagger.ApiOkResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUniversityUsecase.execute({ id });
  }
}
