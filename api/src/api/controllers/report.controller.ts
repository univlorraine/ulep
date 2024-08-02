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
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Swagger from '@nestjs/swagger';
import { GetReportsQueryParams } from 'src/api/dtos/reports/reports-filters';
import { Env } from 'src/configuration';
import { ReportStatus } from 'src/core/models';
import {
  CreateReportCategoryUsecase,
  CreateReportMessageUsecase,
  CreateReportUsecase,
  CreateUnsubscribeReportUsecase,
  DeleteReportCategoryUsecase,
  DeleteReportUsecase,
  GetCategoriesUsecase,
  GetReportCategoryByIdUsecase,
  GetReportUsecase,
  GetReportsByStatusUsecase,
  UpdateReportCategoryUsecase,
  UpdateReportStatusUsecase,
} from '../../core/usecases/report';
import { CurrentUser } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  CreateReportCategoryRequest,
  CreateReportMessageRequest,
  CreateReportRequest,
  GetReportCategoryResponse,
  ReportCategoryResponse,
  ReportResponse,
  UpdateReportCategoryRequest,
  UpdateReportStatusRequest,
} from '../dtos';
import { AuthenticationGuard } from '../guards';

@Controller('reports')
@Swagger.ApiTags('Reports')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  #defaultLanguageCode: string;

  constructor(
    private readonly createReportCategoryUsecase: CreateReportCategoryUsecase,
    private readonly createUnsubscribeUsecase: CreateUnsubscribeReportUsecase,
    private readonly createReportUsecase: CreateReportUsecase,
    private readonly createReportMessageUsecase: CreateReportMessageUsecase,
    private readonly findReportCategoriesUsecase: GetCategoriesUsecase,
    private readonly findReportCategoryByIdUsecase: GetReportCategoryByIdUsecase,
    private readonly getReportsByStatusUsecase: GetReportsByStatusUsecase,
    private readonly getReportUsecase: GetReportUsecase,
    private readonly updateReportStatusUsecase: UpdateReportStatusUsecase,
    private readonly updateReportCategoryUsecase: UpdateReportCategoryUsecase,
    private readonly deleteReportCategoryUsecase: DeleteReportCategoryUsecase,
    private readonly deleteReportUsecase: DeleteReportUsecase,
    env: ConfigService<Env, true>,
  ) {
    this.#defaultLanguageCode = env.get<string>('DEFAULT_TRANSLATION_LANGUAGE');
  }

  @Post('categories')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Category ressource.' })
  @Swagger.ApiCreatedResponse({ type: ReportCategoryResponse })
  async createCategory(@Body() body: CreateReportCategoryRequest) {
    const languageCode = this.#defaultLanguageCode;
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
    return new Collection<ReportCategoryResponse>({
      items: instances.items.map((category) =>
        ReportCategoryResponse.fromDomain(category, languageCode),
      ),
      totalItems: instances.totalItems,
    });
  }

  @Get('categories/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get Category ressource.' })
  @Swagger.ApiOkResponse({ type: GetReportCategoryResponse, isArray: true })
  async findOneCategory(@Param('id', ParseUUIDPipe) id: string) {
    const category = await this.findReportCategoryByIdUsecase.execute({ id });
    return GetReportCategoryResponse.fromDomain(category);
  }

  @Put('categories')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Category ressource.' })
  @Swagger.ApiOkResponse()
  async updateCategory(@Body() request: UpdateReportCategoryRequest) {
    const category = await this.updateReportCategoryUsecase.execute({
      ...request,
    });

    return ReportCategoryResponse.fromDomain(category);
  }

  @Delete('categories/:id')
  @Roles(Role.ADMIN)
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

  @Post('message')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Report message ressource.' })
  @Swagger.ApiCreatedResponse({ type: ReportResponse })
  async createReportMessage(
    @Body() body: CreateReportMessageRequest,
    @CurrentUser() user: KeycloakUser,
  ) {
    const instance = await this.createReportMessageUsecase.execute({
      ...body,
      owner: user.sub,
    });

    return ReportResponse.fromDomain(instance);
  }

  @Post('unsubscribe')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Create a new Unsubscription request.',
  })
  @Swagger.ApiCreatedResponse({ type: ReportResponse })
  async createUnsubscribe(@CurrentUser() user: KeycloakUser) {
    const instance = await this.createUnsubscribeUsecase.execute({
      owner: user.sub,
    });

    return ReportResponse.fromDomain(instance);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Report ressource.' })
  @Swagger.ApiOkResponse({ type: ReportResponse, isArray: true })
  async findByStatus(
    @Query()
    { field, limit, order, page, status, universityId }: GetReportsQueryParams,
    @Headers('Language-code') languageCode?: string,
  ) {
    const instances = await this.getReportsByStatusUsecase.execute({
      limit,
      orderBy: { order, field },
      page,
      where: {
        ...(status ? { status: ReportStatus[status] } : {}),
        ...(universityId ? { universityId: universityId } : {}),
      },
    });

    return new Collection<ReportResponse>({
      items: instances.items.map((item) =>
        ReportResponse.fromDomain(item, languageCode),
      ),
      totalItems: instances.totalItems,
    });
  }

  // TODO: only admin or owner can get report
  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Report ressource.' })
  @Swagger.ApiOkResponse({ type: ReportResponse })
  async findOneReport(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getReportUsecase.execute(id);

    return ReportResponse.fromDomain(instance);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a Report ressource.' })
  @Swagger.ApiOkResponse()
  async updateReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateReportStatusRequest,
  ) {
    const report = await this.updateReportStatusUsecase.execute({
      id,
      ...request,
    });

    return ReportResponse.fromDomain(report);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Report ressource.' })
  @Swagger.ApiOkResponse()
  removeReport(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteReportUsecase.execute({ id });
  }
}
