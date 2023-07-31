import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { KeycloakUser } from '@app/keycloak';
import { ReportStatusesPipe } from '../validators';
import { CurrentUser } from '../decorators';
import { AuthenticationGuard } from '../guards';
import {
  ReportResponse,
  CreateReportRequest,
  UpdateReportStatusRequest,
  InterestCategoryResponse,
  CreateReportCategoryRequest,
  ReportCategoryResponse,
} from '../dtos';
import {
  CreateReportCategoryUsecase,
  CreateReportUsecase,
  DeleteReportCategoryUsecase,
  DeleteReportUsecase,
  GetCategoriesUsecase,
  GetReportsByStatusUsecase,
  GetReportUsecase,
  UpdateReportStatusUsecase,
} from '../../core/usecases/report';
import { ReportStatus } from '../../core/models/report.model';

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

  // TODO: only admin can create a category
  @Post('categories')
  @Swagger.ApiOperation({ summary: 'Create a new Category ressource.' })
  @Swagger.ApiCreatedResponse({ type: InterestCategoryResponse })
  async createCategory(@Body() body: CreateReportCategoryRequest) {
    const instance = await this.createReportCategoryUsecase.execute(body);

    return ReportCategoryResponse.fromDomain(instance);
  }

  // TODO: only connected users can access this route
  @Get('categories')
  @Swagger.ApiOperation({ summary: 'Collection of Category ressource.' })
  @Swagger.ApiOkResponse({ type: InterestCategoryResponse, isArray: true })
  async findAllCategories() {
    const instances = await this.findReportCategoriesUsecase.execute();

    return instances.map(ReportCategoryResponse.fromDomain);
  }

  // TODO: only admin can delete a category
  @Delete('categories/:id')
  @Swagger.ApiOperation({ summary: 'Deletes a Category ressource.' })
  @Swagger.ApiOkResponse()
  removeCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteReportCategoryUsecase.execute({ id });
  }

  // TODO: only connected users can create a report
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

  // TODO: add pagination
  @Get()
  @Swagger.ApiOperation({ summary: 'Collection of Report ressource.' })
  @Swagger.ApiOkResponse({ type: ReportResponse, isArray: true })
  async findByStatus(
    @Query('status', ReportStatusesPipe) status: ReportStatus,
  ) {
    const instances = await this.getReportsByStatusUsecase.execute(
      ReportStatus[status],
    );

    return instances.map(ReportResponse.fromDomain);
  }

  // TODO: only admin or owner can get report
  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Report ressource.' })
  @Swagger.ApiOkResponse({ type: ReportResponse })
  async findOneReport(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getReportUsecase.execute(id);

    return ReportResponse.fromDomain(instance);
  }

  // TODO: only admin can update report
  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a Report ressource.' })
  @Swagger.ApiOkResponse()
  async updateReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateReportStatusRequest,
  ) {
    await this.updateReportStatusUsecase.execute({ id, ...request });
  }

  // TODO: only admin can delete report
  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Deletes a Report ressource.' })
  @Swagger.ApiOkResponse()
  removeReport(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteReportUsecase.execute({ id });
  }
}
