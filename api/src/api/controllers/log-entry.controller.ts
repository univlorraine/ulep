import { Collection } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { User } from '@sentry/node';
import { Response } from 'express';
import { CurrentUser } from 'src/api/decorators';
import {
  CreateCustomLogEntryRequest,
  GetLogEntriesRequest,
  LogEntryByDateResponse,
  LogEntryResponse,
} from 'src/api/dtos/log-entry';
import { GetLogEntriesByDateRequest } from 'src/api/dtos/log-entry/get-log-entries-by-date.request';
import { UpdateCustomLogEntryRequest } from 'src/api/dtos/log-entry/update-custom-log-entry.request';
import { AuthenticationGuard } from 'src/api/guards';
import {
  CreateOrUpdateLogEntryUsecase,
  ExportLogEntriesUsecase,
  GetAllEntriesForUserByDateUsecase,
  GetAllEntriesForUserGroupedByDatesUsecase,
  ShareLogEntriesUsecase,
  ShareLogForResearchEntriesUsecase,
  UnshareLogEntriesUsecase,
  UnshareLogForResearchEntriesUsecase,
  UpdateCustomLogEntryUsecase,
} from 'src/core/usecases/log-entry';

@Controller('log-entries')
@Swagger.ApiTags('Log Entries')
export class LogEntryController {
  logger = new Logger(LogEntryController.name);

  constructor(
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
    private readonly updateCustomLogEntryUsecase: UpdateCustomLogEntryUsecase,
    private readonly getAllEntriesForUserByDateUsecase: GetAllEntriesForUserByDateUsecase,
    private readonly getAllEntriesForUserGroupedByDatesUsecase: GetAllEntriesForUserGroupedByDatesUsecase,
    private readonly shareLogEntriesUsecase: ShareLogEntriesUsecase,
    private readonly unshareLogEntriesUsecase: UnshareLogEntriesUsecase,
    private readonly shareLogForResearchEntriesUsecase: ShareLogForResearchEntriesUsecase,
    private readonly unshareLogForResearchEntriesUsecase: UnshareLogForResearchEntriesUsecase,
    private readonly exportLogEntriesUsecase: ExportLogEntriesUsecase,
  ) {}

  @Get('learning-language/:id/grouped-by-dates')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Get all Log Entries for a user grouped by dates.',
  })
  @Swagger.ApiOkResponse({
    type: () => Collection<LogEntryResponse>,
  })
  async getLogEntriesGroupedByDates(
    @Param('id') id: string,
    @Query() query: GetLogEntriesRequest,
  ) {
    const entries =
      await this.getAllEntriesForUserGroupedByDatesUsecase.execute({
        learningLanguageId: id,
        page: query.page,
        limit: query.limit,
      });

    return entries.map(LogEntryByDateResponse.from);
  }

  @Get('learning-language/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Get all Log Entries for a user and a specific date.',
  })
  @Swagger.ApiOkResponse({
    type: () => Collection<LogEntryResponse>,
  })
  async getLogEntries(
    @Param('id') id: string,
    @Query() query: GetLogEntriesByDateRequest,
  ) {
    const entries = await this.getAllEntriesForUserByDateUsecase.execute({
      learningLanguageId: id,
      date: new Date(query.date),
      page: query.page,
      limit: query.limit,
    });

    return new Collection({
      items: entries.items.map(LogEntryResponse.from),
      totalItems: entries.totalItems,
    });
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new custom Log Entry.' })
  @Swagger.ApiOkResponse({ type: () => LogEntryResponse })
  async createLogEntry(@Body() body: CreateCustomLogEntryRequest) {
    const logEntry = await this.createOrUpdateLogEntryUsecase.execute({
      type: body.type,
      metadata: {
        content: body.content,
        title: body.title,
        duration: body.duration,
        partnerTandemId: body.partnerTandemId,
        tandemFirstname: body.tandemFirstname,
        tandemLastname: body.tandemLastname,
        percentage: body.percentage,
        gameName: body.gameName,
      },
      learningLanguageId: body.learningLanguageId,
      createdAt: body.createdAt,
    });

    if (logEntry) return LogEntryResponse.from(logEntry);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a custom Log Entry.' })
  @Swagger.ApiOkResponse({ type: () => LogEntryResponse })
  async updateLogEntry(
    @Param('id') id: string,
    @Body() body: UpdateCustomLogEntryRequest,
  ) {
    const logEntry = await this.updateCustomLogEntryUsecase.execute({
      id,
      content: body.content,
      title: body.title,
      date: body.date,
      learningLanguageId: body.learningLanguageId,
    });

    return LogEntryResponse.from(logEntry);
  }

  @Post('share/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Share a Learning Language Log Entry.' })
  @Swagger.ApiOkResponse({ type: () => LogEntryResponse })
  async shareLogEntry(@Param('id') id: string) {
    await this.shareLogEntriesUsecase.execute({
      learningLanguageId: id,
    });
  }

  @Post('share-for-research/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Share a Learning Language Log Entry for research.',
  })
  @Swagger.ApiOkResponse({ type: () => LogEntryResponse })
  async shareLogEntryForResearch(@Param('id') id: string) {
    await this.shareLogForResearchEntriesUsecase.execute({
      learningLanguageId: id,
    });
  }

  @Post('unshare/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Unshare a Learning Language Log Entry.' })
  @Swagger.ApiOkResponse({ type: () => LogEntryResponse })
  async unshareLogEntry(@Param('id') id: string) {
    await this.unshareLogEntriesUsecase.execute({
      learningLanguageId: id,
    });
  }

  @Post('unshare-for-research/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Unshare a Learning Language Log Entry for research.',
  })
  @Swagger.ApiOkResponse({ type: () => LogEntryResponse })
  async unshareLogEntryForResearch(@Param('id') id: string) {
    await this.unshareLogForResearchEntriesUsecase.execute({
      learningLanguageId: id,
    });
  }

  @Get('export/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Export all Log Entries for a user.' })
  @Swagger.ApiOkResponse({ type: 'string', description: 'CSV file' })
  async exportLogEntries(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const { buffer, language } = await this.exportLogEntriesUsecase.execute({
      learningLanguageId: id,
      userId: user.sub,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=log_entries_${language.code}.csv`,
    );

    res.send(buffer);
  }
}
