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

@Controller('log-entries')
@Swagger.ApiTags('Log Entries')
export class LogEntryController {
  logger = new Logger(LogEntryController.name);

  constructor() {}

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
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new custom Log Entry.' })
  @Swagger.ApiOkResponse({ type: () => LogEntryResponse })
  async createLogEntry(
    @Body() body: CreateCustomLogEntryRequest,
    @CurrentUser() user: KeycloakUser,
  ) {}

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a custom Log Entry.' })
  @Swagger.ApiOkResponse({ type: () => LogEntryResponse })
  async updateLogEntry(
    @Param('id') id: string,
    @Body() body: UpdateCustomLogEntryRequest,
  ) {}
}
