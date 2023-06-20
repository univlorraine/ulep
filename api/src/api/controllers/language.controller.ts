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
  Logger,
  Query,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { LanguageResponse } from '../dtos/languages/language.response';
import { CreateLanguageUsecase } from 'src/core/usecases/languages/create-language.usecase';
import { GetLanguagesUsecase } from 'src/core/usecases/languages/get-languages.usecase';
import { PaginationDto } from '../dtos/pagination.dto';
import {
  CreateLanguageRequest,
  UpdateLanguageRequest,
} from '../dtos/languages/create-language.request';
import { UpdateLanguageUsecase } from 'src/core/usecases/languages/update-language.usecase';
import { RessourceAlreadyExists } from 'src/core/errors/RessourceAlreadyExists';
import { CollectionResponse } from '../decorators/collection.decorator';
import { Collection } from 'src/shared/types/collection';

@Controller('languages')
@Swagger.ApiTags('Languages')
export class LanguageController {
  private readonly logger = new Logger(LanguageController.name);

  constructor(
    private readonly getLanguagesUsecase: GetLanguagesUsecase,
    private readonly createLanguageUsecase: CreateLanguageUsecase,
    private readonly updateLanguageUsecase: UpdateLanguageUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Language ressource.',
  })
  @CollectionResponse(LanguageResponse)
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<LanguageResponse>> {
    const collection = await this.getLanguagesUsecase.execute({
      page: page,
      limit: limit,
    });

    return new Collection<LanguageResponse>(
      collection.items.map(LanguageResponse.fromDomain),
      collection.totalItems,
    );
  }

  @Post()
  @Swagger.ApiOperation({ summary: 'Creates a Language ressource.' })
  @Swagger.ApiCreatedResponse({ type: LanguageResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() body: CreateLanguageRequest): Promise<LanguageResponse> {
    const language = await this.createLanguageUsecase.execute({
      id: body.id,
      name: body.name,
      code: body.code,
      isEnable: body.enabled,
    });

    return LanguageResponse.fromDomain(language);
  }

  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a Language ressource.' })
  @Swagger.ApiCreatedResponse({ type: LanguageResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { enabled }: UpdateLanguageRequest,
  ) {
    const language = await this.updateLanguageUsecase.execute({
      id: id,
      isEnable: enabled,
    });

    return LanguageResponse.fromDomain(language);
  }
}
