/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Logger,
  Query,
  SerializeOptions,
  Put,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { LanguageResponse } from '../dtos/languages/language.response';
import { CreateLanguageUsecase } from '../../core/usecases/languages/create-language.usecase';
import { GetLanguagesUsecase } from '../../core/usecases/languages/get-languages.usecase';
import { PaginationDto } from '../dtos/pagination.dto';
import {
  CreateLanguageRequest,
  UpdateLanguageRequest,
} from '../dtos/languages/create-language.request';
import { UpdateLanguageUsecase } from '../../core/usecases/languages/update-language.usecase';
import { CollectionResponse } from '../decorators/collection.decorator';
import { Collection } from '../../shared/types/collection';
import { GetLanguageUsecase } from 'src/core/usecases/languages/get-language.usecase';
import { AddLanguageRequestUsecase } from 'src/core/usecases/languages/add-request.usecase';
import { LanguageRequestsCountResponse } from '../dtos/languages/requests-count.response';
import { UserContext } from '../decorators/user-context.decorator';
import { User } from 'src/core/models/user';
import { AuthenticationGuard } from '../guards/authentication.guard';

@Controller('languages')
@Swagger.ApiTags('Languages')
export class LanguageController {
  private readonly logger = new Logger(LanguageController.name);

  constructor(
    private readonly getLanguagesUsecase: GetLanguagesUsecase,
    private readonly getLanguageUsecase: GetLanguageUsecase,
    private readonly createLanguageUsecase: CreateLanguageUsecase,
    private readonly updateLanguageUsecase: UpdateLanguageUsecase,
    private readonly addLanguageRequestUsecase: AddLanguageRequestUsecase,
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

    return new Collection<LanguageResponse>({
      items: collection.items.map(LanguageResponse.fromDomain),
      totalItems: collection.totalItems,
    });
  }

  @Get(':code')
  @SerializeOptions({ groups: ['read', 'language:read'] })
  @Swagger.ApiOperation({ summary: 'Retrieve a Language ressource.' })
  @Swagger.ApiOkResponse({ type: LanguageResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(@Param('code') code: string): Promise<LanguageResponse> {
    const instance = await this.getLanguageUsecase.execute({ code });

    return LanguageResponse.fromDomain(instance);
  }

  @Post()
  @SerializeOptions({ groups: ['read', 'language:read'] })
  @Swagger.ApiOperation({ summary: 'Creates a Language ressource.' })
  @Swagger.ApiCreatedResponse({ type: LanguageResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() body: CreateLanguageRequest): Promise<LanguageResponse> {
    const language = await this.createLanguageUsecase.execute({ ...body });

    return LanguageResponse.fromDomain(language);
  }

  @Post(':code/requests')
  @SerializeOptions({ groups: ['read'] })
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Add new requests .' })
  @Swagger.ApiCreatedResponse({ type: LanguageRequestsCountResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async addRequest(
    @Param('code') code: string,
    @UserContext() user: User,
  ): Promise<LanguageRequestsCountResponse> {
    const count = await this.addLanguageRequestUsecase.execute({
      code,
      userId: user.id,
    });

    return new LanguageRequestsCountResponse(count);
  }

  @Put(':code')
  @SerializeOptions({ groups: ['read', 'language:read'] })
  @Swagger.ApiOperation({ summary: 'Updates a Language ressource.' })
  @Swagger.ApiCreatedResponse({ type: LanguageResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async update(
    @Param('code') code: string,
    @Body() request: UpdateLanguageRequest,
  ) {
    const language = await this.updateLanguageUsecase.execute({
      code: code,
      ...request,
    });

    return LanguageResponse.fromDomain(language);
  }
}
