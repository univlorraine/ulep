import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  ParseUUIDPipe,
  SerializeOptions,
  UseGuards,
  Query,
  Headers,
  Put,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  InterestResponse,
  CreateInterestRequest,
  InterestCategoryResponse,
  CreateInterestCategoryRequest,
  GetInterestResponse,
  UpdateInterestRequest,
} from '../dtos/interests';
import {
  CreateInterestCategoryUsecase,
  CreateInterestUsecase,
  DeleteInterestCategoryUsecase,
  DeleteInterestUsecase,
  GetInterestUsecase,
  GetInterestsByCategoriesUsecase,
  UpdateInterestCategoryUsecase,
  UpdateInterestUsecase,
} from '../../core/usecases/interest';
import { AuthenticationGuard } from '../guards';
import { configuration } from 'src/configuration';
import { Roles } from '../decorators/roles.decorator';
import { GetInterestsQueryParams } from 'src/api/dtos/interests/interests-filter';
import { Collection } from '@app/common';

@Controller('interests')
@Swagger.ApiTags('Interests')
export class InterestController {
  private readonly logger = new Logger(InterestController.name);

  constructor(
    private readonly createInterestUsecase: CreateInterestUsecase,
    private readonly createCategoryUsecase: CreateInterestCategoryUsecase,
    private readonly getInterest: GetInterestUsecase,
    private readonly getInterestsByCategoriesUsecase: GetInterestsByCategoriesUsecase,
    private readonly deleteCategoryUsecase: DeleteInterestCategoryUsecase,
    private readonly deleteInterestUsecase: DeleteInterestUsecase,
    private readonly updateInterestUsecase: UpdateInterestUsecase,
    private readonly updateIterestCategoryUsecase: UpdateInterestCategoryUsecase,
  ) {}

  @Post()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Interest ressource.' })
  @Swagger.ApiCreatedResponse({ type: InterestResponse })
  async createInterest(@Body() body: CreateInterestRequest) {
    const languageCode = configuration().defaultTranslationLanguage;
    const instance = await this.createInterestUsecase.execute({
      ...body,
      languageCode,
    });

    return InterestResponse.fromDomain(instance);
  }

  @Post('categories')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Category ressource.' })
  @Swagger.ApiCreatedResponse({ type: InterestResponse })
  async createCategory(@Body() body: CreateInterestCategoryRequest) {
    const languageCode = configuration().defaultTranslationLanguage;
    const instance = await this.createCategoryUsecase.execute({
      ...body,
      languageCode,
    });

    return InterestCategoryResponse.fromDomain(instance);
  }

  @Get('categories')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'category:read'] })
  @Swagger.ApiOperation({ summary: 'Collection of Interest ressource.' })
  @Swagger.ApiOkResponse({ type: InterestCategoryResponse, isArray: true })
  async findAll(
    @Query() { limit, order, page }: GetInterestsQueryParams,
    @Headers('Language-code') languageCode?: string,
  ) {
    const categories = await this.getInterestsByCategoriesUsecase.execute({
      limit,
      order,
      page,
    });

    return new Collection<InterestCategoryResponse>({
      items: categories.items.map((category) =>
        InterestCategoryResponse.fromDomain(category, languageCode),
      ),
      totalItems: categories.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'category:read'] })
  @Swagger.ApiOperation({ summary: 'Collection of Interest ressource.' })
  @Swagger.ApiOkResponse({ type: GetInterestResponse, isArray: true })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const interest = await this.getInterest.execute({ id });

    return GetInterestResponse.fromDomain(interest);
  }

  @Delete(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Interest ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteInterestUsecase.execute({ id });
  }

  @Delete('categories/:id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Category ressource.' })
  @Swagger.ApiOkResponse()
  removeCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCategoryUsecase.execute({ id });
  }

  @Put()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update an Interest ressource.' })
  @Swagger.ApiOkResponse()
  updateInterest(@Body() body: UpdateInterestRequest) {
    return this.updateInterestUsecase.execute(body);
  }

  @Put()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update an Category ressource.' })
  @Swagger.ApiOkResponse()
  updateInterestCategory(@Body() body: UpdateInterestRequest) {
    return this.updateIterestCategoryUsecase.execute(body);
  }
}
