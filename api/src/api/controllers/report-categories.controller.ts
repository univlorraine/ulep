import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  CreateReportCategoryUsecase,
  GetReportCategoriesUsecase,
} from '../../core/usecases/reports';
import {
  CreateReportCategoryRequest,
  ReportCategoryResponse,
} from '../dtos/reports';
import { DeleteReportCategoryUsecase } from 'src/core/usecases/reports/delete-category.usecase';
import { Collection } from 'src/shared/types/collection';
import { CollectionResponse } from '../decorators/collection.decorator';

@Controller('report-categories')
@Swagger.ApiTags('ReportCategories')
export class ReportCategoriesController {
  constructor(
    private readonly createReportCategoryUsecase: CreateReportCategoryUsecase,
    private readonly deleteReportCategoryUsecase: DeleteReportCategoryUsecase,
    private readonly getReportCategoriesUsecase: GetReportCategoriesUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of ReportCategory ressource.',
  })
  @CollectionResponse(ReportCategoryResponse)
  async getCategories(): Promise<Collection<ReportCategoryResponse>> {
    const categories = await this.getReportCategoriesUsecase.execute();

    return new Collection(
      categories.map(ReportCategoryResponse.fromDomain),
      categories.length,
    );
  }

  @Post()
  @Swagger.ApiOperation({ summary: 'Create a ReportCategory ressource.' })
  async createCategory(
    @Body() body: CreateReportCategoryRequest,
  ): Promise<void> {
    await this.createReportCategoryUsecase.execute({ name: body.name });
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Delete a ReportCategory ressource.' })
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.deleteReportCategoryUsecase.execute({ id });
  }
}
