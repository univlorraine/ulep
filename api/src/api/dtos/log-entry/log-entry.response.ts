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

import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  LogEntries,
  LogEntryAddVocabulary,
  LogEntryCommunityChat,
  LogEntryCustomEntry,
  LogEntryEditActivity,
  LogEntryPlayedGame,
  LogEntryPublishActivity,
  LogEntryShareVocabulary,
  LogEntrySubmitActivity,
  LogEntryTandemChat,
  LogEntryType,
  LogEntryVisio,
} from 'src/core/models/log-entry.model';
import { LogEntriesByDates } from 'src/core/ports/log-entry.repository';

type LogEntryMetadataProps = {
  activityId?: string;
  activityTitle?: string;
  updatedCount?: number;
  conversationId?: string;
  content?: string;
  gameName?: string;
  title?: string;
  duration?: number;
  entryNumber?: number;
  percentage?: number;
  tandemFirstname?: string;
  tandemLastname?: string;
  vocabularyListId?: string;
  vocabularyListName?: string;
};

export class LogEntryByDateResponse {
  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  date: Date;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  count: number;

  @Swagger.ApiProperty({ type: 'array', isArray: true })
  @Expose({ groups: ['read'] })
  entries: LogEntryResponse[];

  constructor(partial: Partial<LogEntryByDateResponse>) {
    Object.assign(this, partial);
  }

  static from(logEntriesByDates: LogEntriesByDates): LogEntryByDateResponse {
    return new LogEntryByDateResponse({
      date: logEntriesByDates.date,
      count: logEntriesByDates.count,
      entries: logEntriesByDates.entries.map(LogEntryResponse.from),
    });
  }
}

export class LogEntryMetadataResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  activityId?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  activityTitle?: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  updatedCount?: number;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  conversationId?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  content?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  gameName?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  title?: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  duration?: number;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  entryNumber?: number;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  percentage?: number;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  tandemFirstname?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  tandemLastname?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  vocabularyListId?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'api', 'api-admin'] })
  vocabularyListName?: string;

  constructor(partial: Partial<LogEntryMetadataResponse>) {
    Object.assign(this, partial);
  }

  static from(metadata: LogEntryMetadataProps): LogEntryMetadataResponse {
    return new LogEntryMetadataResponse(metadata);
  }
}

export class LogEntryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['api', 'api-admin'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', enum: LogEntryType })
  @Expose({ groups: ['api', 'api-admin'] })
  type: LogEntryType;

  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['api', 'api-admin'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'object' })
  @Expose({ groups: ['api', 'api-admin'] })
  metadata: LogEntryMetadataResponse;

  constructor(partial: Partial<LogEntryResponse>) {
    Object.assign(this, partial);
  }

  static from(logEntry: LogEntries): LogEntryResponse {
    return new LogEntryResponse({
      id: logEntry.id,
      type: logEntry.type,
      createdAt: logEntry.createdAt,
      metadata: LogEntryMetadataResponse.from(
        LogEntryResponse.getMetadata(logEntry),
      ),
    });
  }

  private static getMetadata(logEntry: LogEntries): LogEntryMetadataProps {
    let metadata: LogEntryMetadataProps = {};

    if (logEntry instanceof LogEntryAddVocabulary) {
      metadata = {
        vocabularyListId: logEntry.vocabularyListId,
        vocabularyListName: logEntry.vocabularyListName,
        entryNumber: logEntry.entryNumber,
      };
    }

    if (logEntry instanceof LogEntryShareVocabulary) {
      metadata = {
        vocabularyListId: logEntry.vocabularyListId,
        vocabularyListName: logEntry.vocabularyListName,
      };
    }

    if (logEntry instanceof LogEntryVisio) {
      metadata = {
        duration: logEntry.duration,
        tandemFirstname: logEntry.tandemFirstname,
        tandemLastname: logEntry.tandemLastname,
      };
    }

    if (logEntry instanceof LogEntryTandemChat) {
      metadata = {
        conversationId: logEntry.conversationId,
        tandemFirstname: logEntry.tandemFirstname,
        tandemLastname: logEntry.tandemLastname,
      };
    }

    if (logEntry instanceof LogEntryCommunityChat) {
      metadata = {
        conversationId: logEntry.conversationId,
      };
    }

    if (logEntry instanceof LogEntryCustomEntry) {
      metadata = {
        content: logEntry.content,
        title: logEntry.title,
      };
    }

    if (logEntry instanceof LogEntryEditActivity) {
      metadata = {
        activityId: logEntry.activityId,
        activityTitle: logEntry.activityTitle,
      };
    }

    if (logEntry instanceof LogEntrySubmitActivity) {
      metadata = {
        activityId: logEntry.activityId,
        activityTitle: logEntry.activityTitle,
      };
    }

    if (logEntry instanceof LogEntryPublishActivity) {
      metadata = {
        activityId: logEntry.activityId,
        activityTitle: logEntry.activityTitle,
      };
    }

    if (logEntry instanceof LogEntryPlayedGame) {
      metadata = {
        gameName: logEntry.gameName,
        percentage: logEntry.percentage,
      };
    }

    return metadata;
  }
}
