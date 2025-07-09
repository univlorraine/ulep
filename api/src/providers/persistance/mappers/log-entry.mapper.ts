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

import { Prisma } from '@prisma/client';
import {
  LogEntry,
  LogEntryAddVocabulary,
  LogEntryCommunityChat,
  LogEntryCustomEntry,
  LogEntryEditActivity,
  LogEntryPlayedGame,
  LogEntryPublishActivity,
  LogEntryShareVocabulary,
  LogEntrySharingLogs,
  LogEntrySharingLogsForResearch,
  LogEntrySubmitActivity,
  LogEntryTandemChat,
  LogEntryType,
  LogEntryUnsharingLogs,
  LogEntryVisio,
} from 'src/core/models/log-entry.model';
import {
  learningLanguageMapper,
  LearningLanguageRelations,
  LearningLanguageSnapshot,
} from 'src/providers/persistance/mappers/learningLanguage.mapper';

export const LogEntryInclude = Prisma.validator<Prisma.LogEntryInclude>()({
  LearningLanguage: { include: LearningLanguageRelations },
});

export const LogEntryRelations = {
  include: LogEntryInclude,
};

export type LogEntrySnapshot = Prisma.LogEntryGetPayload<
  typeof LogEntryRelations
> & {
  LearningLanguage: LearningLanguageSnapshot;
};

export const logEntryMapper = (
  snapshot: LogEntrySnapshot,
): LogEntry | undefined => {
  const data = snapshot.metadata as {
    activityId: string;
    activityTitle: string;
    updatedCount: number;
    conversationId: string;
    content: string;
    gameName: string;
    duration: number;
    entryNumber: number;
    totalCardPlayed: number;
    successCardPlayed: number;
    percentage: number;
    tandemFirstname: string;
    tandemLastname: string;
    partnerTandemId: string;
    vocabularyListId: string;
    vocabularyListName: string;
    title: string;
    roomName: string;
  };
  switch (snapshot.type) {
    case LogEntryType.VISIO:
      return new LogEntryVisio({
        id: snapshot.id,
        type: LogEntryType.VISIO,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        duration: data.duration,
        tandemFirstname: data.tandemFirstname,
        tandemLastname: data.tandemLastname,
        partnerTandemId: data.partnerTandemId,
        roomName: data.roomName,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.TANDEM_CHAT:
      return new LogEntryTandemChat({
        id: snapshot.id,
        type: LogEntryType.TANDEM_CHAT,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        duration: data.duration,
        tandemFirstname: data.tandemFirstname,
        tandemLastname: data.tandemLastname,
        conversationId: data.conversationId,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.COMMUNITY_CHAT:
      return new LogEntryCommunityChat({
        id: snapshot.id,
        type: LogEntryType.COMMUNITY_CHAT,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        conversationId: data.conversationId,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.CUSTOM_ENTRY:
      return new LogEntryCustomEntry({
        id: snapshot.id,
        type: LogEntryType.CUSTOM_ENTRY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        content: data.content,
        title: data.title,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.PLAYED_GAME:
      return new LogEntryPlayedGame({
        id: snapshot.id,
        type: LogEntryType.PLAYED_GAME,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        totalCardPlayed: data.totalCardPlayed,
        successCardPlayed: data.successCardPlayed,
        percentage: (data.successCardPlayed / data.totalCardPlayed) * 100,
        gameName: data.gameName,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.SHARING_LOGS:
      return new LogEntrySharingLogs({
        id: snapshot.id,
        type: LogEntryType.SHARING_LOGS,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.UNSHARE_LOGS:
      return new LogEntryUnsharingLogs({
        id: snapshot.id,
        type: LogEntryType.UNSHARE_LOGS,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.SHARING_LOGS_FOR_RESEARCH:
      return new LogEntrySharingLogsForResearch({
        id: snapshot.id,
        type: LogEntryType.SHARING_LOGS_FOR_RESEARCH,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.SUBMIT_ACTIVITY:
      return new LogEntrySubmitActivity({
        id: snapshot.id,
        type: LogEntryType.SUBMIT_ACTIVITY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        activityId: data.activityId,
        activityTitle: data.activityTitle,
        updatedCount: data.updatedCount,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.PUBLISH_ACTIVITY:
      return new LogEntryPublishActivity({
        id: snapshot.id,
        type: LogEntryType.PUBLISH_ACTIVITY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        activityId: data.activityId,
        activityTitle: data.activityTitle,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.EDIT_ACTIVITY:
      return new LogEntryEditActivity({
        id: snapshot.id,
        type: LogEntryType.EDIT_ACTIVITY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        activityId: data.activityId,
        activityTitle: data.activityTitle,
        updatedCount: data.updatedCount,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.ADD_VOCABULARY:
      return new LogEntryAddVocabulary({
        id: snapshot.id,
        type: LogEntryType.ADD_VOCABULARY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        vocabularyListName: data.vocabularyListName,
        vocabularyListId: data.vocabularyListId,
        entryNumber: data.entryNumber,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.SHARE_VOCABULARY:
      return new LogEntryShareVocabulary({
        id: snapshot.id,
        type: LogEntryType.SHARE_VOCABULARY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        vocabularyListId: data.vocabularyListId,
        vocabularyListName: data.vocabularyListName,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    default:
      return undefined;
  }
};
