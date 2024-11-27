import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
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
  GetAllEntriesForUserByDateUsecase,
  GetAllEntriesForUserGroupedByDatesUsecase,
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
  ) {}

  @Get('user/:id/grouped-by-dates')
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
    @CurrentUser() user: KeycloakUser,
  ) {
    const entries =
      await this.getAllEntriesForUserGroupedByDatesUsecase.execute({
        id,
        ownerId: user.sub,
        page: query.page,
        limit: query.limit,
      });

    return entries.map(LogEntryByDateResponse.from);
  }

  @Get('user/:id')
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
    @CurrentUser() user: KeycloakUser,
  ) {
    const entries = await this.getAllEntriesForUserByDateUsecase.execute({
      id,
      ownerId: user.sub,
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
  async createLogEntry(
    @Body() body: CreateCustomLogEntryRequest,
    @CurrentUser() user: KeycloakUser,
  ) {
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
      ownerId: user.sub,
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
    @CurrentUser() user: KeycloakUser,
  ) {
    const logEntry = await this.updateCustomLogEntryUsecase.execute({
      id,
      content: body.content,
      title: body.title,
      date: body.date,
      ownerId: user.sub,
    });

    return LogEntryResponse.from(logEntry);
  }
}
