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
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  InterestResponse,
  CreateInterestRequest,
  InterestCategoryResponse,
  CreateInterestCategoryRequest,
} from '../dtos/interests';
import {
  CreateInterestCategoryUsecase,
  CreateInterestUsecase,
  DeleteInterestCategoryUsecase,
  DeleteInterestUsecase,
  GetInterestsByCategoriesUsecase,
} from '../../core/usecases/interest';

@Controller('interests')
@Swagger.ApiTags('Interests')
export class InterestController {
  private readonly logger = new Logger(InterestController.name);

  constructor(
    private readonly createInterestUsecase: CreateInterestUsecase,
    private readonly createCategoryUsecase: CreateInterestCategoryUsecase,
    private readonly getInterestsByCategoriesUsecase: GetInterestsByCategoriesUsecase,
    private readonly deleteCategoryUsecase: DeleteInterestCategoryUsecase,
    private readonly deleteInterestUsecase: DeleteInterestUsecase,
  ) {}

  @Post()
  @Swagger.ApiOperation({ summary: 'Create a new Interest ressource.' })
  @Swagger.ApiCreatedResponse({ type: InterestResponse })
  async createInterest(@Body() body: CreateInterestRequest) {
    const instance = await this.createInterestUsecase.execute(body);

    return InterestResponse.fromDomain(instance);
  }

  @Post('categories')
  @Swagger.ApiOperation({ summary: 'Create a new Category ressource.' })
  @Swagger.ApiCreatedResponse({ type: InterestResponse })
  async createCategory(@Body() body: CreateInterestCategoryRequest) {
    const instance = await this.createCategoryUsecase.execute(body);

    return InterestCategoryResponse.fromDomain(instance);
  }

  @Get('categories')
  @SerializeOptions({ groups: ['read', 'category:read'] })
  @Swagger.ApiOperation({ summary: 'Collection of Interest ressource.' })
  @Swagger.ApiOkResponse({ type: InterestCategoryResponse, isArray: true })
  async findAll() {
    const categories = await this.getInterestsByCategoriesUsecase.execute();

    return categories.map(InterestCategoryResponse.fromDomain);
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Deletes a Interest ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteInterestUsecase.execute({ id });
  }

  @Delete('categories/:id')
  @Swagger.ApiOperation({ summary: 'Deletes a Category ressource.' })
  @Swagger.ApiOkResponse()
  removeCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCategoryUsecase.execute({ id });
  }
}
