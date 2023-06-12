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
import { UniversityDto } from '../dtos/university.dto';
import { CreateUniversityUsecase } from 'src/core/usecases/universities/create-university.usecase';
import { UpdateUniversityUsecase } from 'src/core/usecases/universities/update-university.usecase';
import { PaginationDto } from '../dtos/pagination.dto';
import { GetUniversitiesUsecase } from 'src/core/usecases/universities/get-universities.usecase';
import { Collection } from 'src/shared/types/collection';
import { DeleteUniversityUsecase } from 'src/core/usecases/universities/delete-university.usecase';
import { GetUniversityUsecase } from 'src/core/usecases/universities/get-university.usecase';

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
  @Swagger.ApiOkResponse({ type: UniversityDto, isArray: true })
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<UniversityDto>> {
    const result = await this.getUniversitiesUsecase.execute({ page, limit });

    return {
      items: result.items.map(UniversityDto.fromDomain),
      total: result.total,
    };
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Retrieve a University ressource.' })
  @Swagger.ApiOkResponse({ type: UniversityDto })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UniversityDto> {
    const result = await this.getUniversityUsecase.execute({ id });

    return UniversityDto.fromDomain(result);
  }

  @Post()
  @Swagger.ApiOperation({ summary: 'Creates a University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityDto })
  async create(@Body() body: UniversityDto): Promise<UniversityDto> {
    const result = await this.createUniversityUsecase.execute({
      name: body.name,
    });

    return UniversityDto.fromDomain(result);
  }

  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a University ressource.' })
  @Swagger.ApiCreatedResponse({ type: UniversityDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UniversityDto,
  ): Promise<UniversityDto> {
    const instance = await this.updateUniversityUsecase.execute({
      id,
      name: body.name,
    });

    return UniversityDto.fromDomain(instance);
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Deletes a University ressource.' })
  @Swagger.ApiOkResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUniversityUsecase.execute({ id });
  }
}
