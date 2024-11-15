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
  LogEntryResponse,
} from 'src/api/dtos/log-entry';
import { UpdateCustomLogEntryRequest } from 'src/api/dtos/log-entry/update-custom-log-entry.request';
import { AuthenticationGuard } from 'src/api/guards';
import {
  CreateOrUpdateLogEntryUsecase,
  GetAllEntriesForUserUsecase,
  UpdateCustomLogEntryUsecase,
} from 'src/core/usecases/log-entry';

@Controller('log-entries')
@Swagger.ApiTags('Log Entries')
export class LogEntryController {
  logger = new Logger(LogEntryController.name);

  constructor(
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
    private readonly updateCustomLogEntryUsecase: UpdateCustomLogEntryUsecase,
    private readonly getAllEntriesForUserUsecase: GetAllEntriesForUserUsecase,
  ) {}

  @Get('user/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get all Log Entries for a user.' })
  @Swagger.ApiOkResponse({
    type: () => Collection<LogEntryResponse>,
  })
  async getLogEntries(
    @Param('id') id: string,
    @Query() query: GetLogEntriesRequest,
    @CurrentUser() user: KeycloakUser,
  ) {
    const entries = await this.getAllEntriesForUserUsecase.execute({
      id,
      ownerId: user.sub,
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
      },
      ownerId: user.sub,
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
      ownerId: user.sub,
    });

    return LogEntryResponse.from(logEntry);
  }
}
