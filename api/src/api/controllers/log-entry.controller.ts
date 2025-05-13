/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
  SerializeOptions,
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
  GetAllEntriesForContactUsecase,
  GetAllEntriesForUserByDateUsecase,
  GetAllEntriesForUserGroupedByDatesUsecase,
  GetAllEntriesUsecase,
  ShareLogEntriesUsecase,
  ShareLogForResearchEntriesUsecase,
  UnshareLogEntriesUsecase,
  UnshareLogForResearchEntriesUsecase,
  UpdateCustomLogEntryUsecase,
} from 'src/core/usecases/log-entry';
import { ProfileWithLogEntriesResponse } from '../dtos/profiles/profiles-with-logentries.response';
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
    private readonly getAllEntriesForContact: GetAllEntriesForContactUsecase,
    private readonly getAllEntries: GetAllEntriesUsecase,
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
        totalCardPlayed: body.totalCardPlayed,
        successCardPlayed: body.successCardPlayed,
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

  @Get('')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['api', 'api-admin'] })
  @Swagger.ApiOperation({
    summary: 'Get all Log Entries',
  })
  @Swagger.ApiOkResponse({
    type: () => Collection<ProfileWithLogEntriesResponse>,
  })
  async getAllLogEntries(
    @Query() query: GetLogEntriesRequest,
    @CurrentUser() user: User,
  ) {
    const entries = await this.getAllEntries.execute({
      page: query.page,
      limit: query.limit,
      userId: user.sub,
      getNoSharedProfiles: query.getNoSharedProfiles ? true : false,
    });
    return entries.items.map(
      ProfileWithLogEntriesResponse.fromDomainWithLogEntries,
    );
  }

  @Get('contact/:contactId')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['api', 'api-admin'] })
  @Swagger.ApiOperation({
    summary: 'Get all Log Entries for a contact id',
  })
  @Swagger.ApiOkResponse({
    type: () => ProfileWithLogEntriesResponse,
  })
  async getAllLogEntriesForContact(
    @Param('contactId') contactId: string,
    @Query() query: GetLogEntriesRequest,
    @CurrentUser() user: User,
  ) {
    const entries = await this.getAllEntriesForContact.execute({
      contactId: contactId,
      userId: user.sub,
      getNoSharedProfiles: query.getNoSharedProfiles ? true : false,
    });
    return ProfileWithLogEntriesResponse.fromDomainWithLogEntries(entries);
  }
}
