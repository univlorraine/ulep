import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { configuration } from 'src/configuration';
import {
  CreateReportCategoryUsecase,
  CreateReportUsecase,
  DeleteReportCategoryUsecase,
  DeleteReportUsecase,
  GetCategoriesUsecase,
  GetReportUsecase,
  GetReportsByStatusUsecase,
  UpdateReportStatusUsecase,
} from '../../core/usecases/report';
import { CurrentUser } from '../decorators';
import { Roles } from '../decorators/roles.decorator';
import {
  CreateReportCategoryRequest,
  CreateReportRequest,
  ReportCategoryResponse,
  ReportResponse,
  UpdateReportStatusRequest,
} from '../dtos';
import { AuthenticationGuard } from '../guards';
import { GetReportsQueryParams } from 'src/api/dtos/reports/reports-filters';
import { ReportStatus } from 'src/core/models';

@Controller('reports')
@Swagger.ApiTags('Reports')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(
    private readonly createReportCategoryUsecase: CreateReportCategoryUsecase,
    private readonly createReportUsecase: CreateReportUsecase,
    private readonly findReportCategoriesUsecase: GetCategoriesUsecase,
    private readonly getReportsByStatusUsecase: GetReportsByStatusUsecase,
    private readonly getReportUsecase: GetReportUsecase,
    private readonly updateReportStatusUsecase: UpdateReportStatusUsecase,
    private readonly deleteReportCategoryUsecase: DeleteReportCategoryUsecase,
    private readonly deleteReportUsecase: DeleteReportUsecase,
  ) {}

  @Post('categories')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Category ressource.' })
  @Swagger.ApiCreatedResponse({ type: ReportCategoryResponse })
  async createCategory(@Body() body: CreateReportCategoryRequest) {
    const languageCode = configuration().defaultTranslationLanguage;
    const instance = await this.createReportCategoryUsecase.execute({
      languageCode,
      name: body.name,
      translations: body.translations,
    });

    return ReportCategoryResponse.fromDomain(instance);
  }

  @Get('categories')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Category ressource.' })
  @Swagger.ApiOkResponse({ type: ReportCategoryResponse, isArray: true })
  async findAllCategories(@Headers('Language-code') languageCode?: string) {
    const instances = await this.findReportCategoriesUsecase.execute();
    const code =
      configuration().defaultTranslationLanguage !== languageCode
        ? languageCode
        : undefined;
    return new Collection<ReportCategoryResponse>({
      items: instances.items.map((category) =>
        ReportCategoryResponse.fromDomain(category, code),
      ),
      totalItems: instances.totalItems,
    });
  }

  @Delete('categories/:id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Category ressource.' })
  @Swagger.ApiOkResponse()
  removeCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteReportCategoryUsecase.execute({ id });
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Report ressource.' })
  @Swagger.ApiCreatedResponse({ type: ReportResponse })
  async createReport(
    @Body() body: CreateReportRequest,
    @CurrentUser() user: KeycloakUser,
  ) {
    const instance = await this.createReportUsecase.execute({
      ...body,
      owner: user.sub,
    });

    return ReportResponse.fromDomain(instance);
  }

  @Get()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Report ressource.' })
  @Swagger.ApiOkResponse({ type: ReportResponse, isArray: true })
  async findByStatus(
    @Query() { field, limit, order, page, status }: GetReportsQueryParams,
  ) {
    const instances = await this.getReportsByStatusUsecase.execute({
      limit,
      orderBy: { order, field },
      page,
      where: status ? { status: { equals: ReportStatus[status] } } : undefined,
    });

    return new Collection<ReportResponse>({
      items: instances.items.map(ReportResponse.fromDomain),
      totalItems: instances.totalItems,
    });
  }

  // TODO: only admin or owner can get report
  @Get(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Report ressource.' })
  @Swagger.ApiOkResponse({ type: ReportResponse })
  async findOneReport(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getReportUsecase.execute(id);

    return ReportResponse.fromDomain(instance);
  }

  @Patch(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a Report ressource.' })
  @Swagger.ApiOkResponse()
  async updateReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateReportStatusRequest,
  ) {
    await this.updateReportStatusUsecase.execute({ id, ...request });
  }

  @Delete(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Report ressource.' })
  @Swagger.ApiOkResponse()
  removeReport(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteReportUsecase.execute({ id });
  }
}
