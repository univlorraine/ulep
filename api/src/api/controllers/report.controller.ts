import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  CreateReportUsecase,
  DeleteReportUsecase,
  GetReportUsecase,
  GetReportsUsecase,
} from '../../core/usecases/reports';
import { CollectionResponse } from '../decorators/collection.decorator';
import {
  CreateReportRequest,
  ReportResponse,
  ReportQueryFilter,
} from '../dtos/reports';
import { Collection } from 'src/shared/types/collection';
import { UserContext } from '../decorators/user-context.decorator';
import { User } from 'src/core/models/user';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { UuidProvider } from '../services/uuid-provider';

@Controller('reports')
@Swagger.ApiTags('Reports')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(
    private readonly createReportUsecase: CreateReportUsecase,
    private readonly deleteReportUsecase: DeleteReportUsecase,
    private readonly getReportsUsecase: GetReportsUsecase,
    private readonly getReportUsecase: GetReportUsecase,
    private readonly uuidProvider: UuidProvider,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Report ressource.',
  })
  @CollectionResponse(ReportResponse)
  async getCollection(
    @Query() { page = 1, limit = 30, category }: ReportQueryFilter,
  ): Promise<Collection<ReportResponse>> {
    const command = {
      page: page,
      limit: limit,
      category: category ? { name: { equals: category } } : undefined,
    };

    const reports = await this.getReportsUsecase.execute(command);

    return new Collection({
      items: reports.items.map(ReportResponse.fromDomain),
      totalItems: reports.totalItems,
    });
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Retrieve a Report ressource.' })
  @Swagger.ApiOkResponse({ type: ReportResponse })
  async getOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReportResponse> {
    const report = await this.getReportUsecase.execute({ id });

    return ReportResponse.fromDomain(report);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a Report ressource.' })
  async createOne(
    @UserContext() user: User,
    @Body() body: CreateReportRequest,
  ): Promise<void> {
    await this.createReportUsecase.execute({
      id: this.uuidProvider.generate(),
      userId: user.id,
      ...body,
    });
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Delete a Report ressource.' })
  async deleteOne(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteReportUsecase.execute({ id });
  }
}
