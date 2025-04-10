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

import {
    LogEntriesByDates,
    LogEntry,
    LogEntryAddVocabulary,
    LogEntryCommunityChat,
    LogEntryCustomEntry,
    LogEntryEditActivity,
    LogEntryPlayedGame,
    LogEntryPublishActivity,
    LogEntryShareVocabulary,
    LogEntrySharingLogs,
    LogEntrySubmitActivity,
    LogEntryTandemChat,
    LogEntryType,
    LogEntryVisio,
} from '../domain/entities/LogEntry';

interface LogEntryMetadata {
    activityId?: string;
    activityTitle?: string;
    updatedCount?: number;
    conversationId?: string;
    content?: string;
    duration?: number;
    entryNumber?: number;
    gameName?: string;
    totalCardPlayed?: number;
    successCardPlayed?: number;
    tandemFirstname?: string;
    tandemLastname?: string;
    vocabularyListId?: string;
    vocabularyListName?: string;
    title?: string;
}

interface LogEntryCommand {
    id: string;
    createdAt: Date;
    type: string;
    ownerId: string;
    metadata: LogEntryMetadata;
}

export interface LogEntryByDateCommand {
    date: Date;
    count: number;
    entries: LogEntryCommand[];
}

export const logEntryByDateCommandToDomain = (command: LogEntryByDateCommand) => {
    return new LogEntriesByDates({
        date: new Date(command.date),
        count: command.count,
        entries: command.entries.map(logEntryCommandToDomain).filter((entry): entry is LogEntry => entry !== undefined),
    });
};

export const logEntryCommandToDomain = (command: LogEntryCommand): LogEntry | undefined => {
    switch (command.type) {
        case LogEntryType.ADD_VOCABULARY:
            return new LogEntryAddVocabulary({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                vocabularyListId: command.metadata.vocabularyListId!,
                vocabularyListName: command.metadata.vocabularyListName!,
                entryNumber: command.metadata.entryNumber!,
            });
        case LogEntryType.SHARE_VOCABULARY:
            return new LogEntryShareVocabulary({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                vocabularyListId: command.metadata.vocabularyListId!,
                vocabularyListName: command.metadata.vocabularyListName!,
            });
        case LogEntryType.COMMUNITY_CHAT:
            return new LogEntryCommunityChat({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                conversationId: command.metadata.conversationId!,
            });
        case LogEntryType.CUSTOM_ENTRY:
            return new LogEntryCustomEntry({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                content: command.metadata.content!,
                title: command.metadata.title!,
            });
        case LogEntryType.EDIT_ACTIVITY:
            return new LogEntryEditActivity({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                activityId: command.metadata.activityId!,
                activityTitle: command.metadata.activityTitle!,
                updatedCount: command.metadata.updatedCount!,
            });
        case LogEntryType.PLAYED_GAME:
            return new LogEntryPlayedGame({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                totalCardPlayed: command.metadata.totalCardPlayed!,
                successCardPlayed: command.metadata.successCardPlayed!,
                gameName: command.metadata.gameName!,
            });
        case LogEntryType.SHARING_LOGS:
            return new LogEntrySharingLogs({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
            });
        case LogEntryType.SUBMIT_ACTIVITY:
            return new LogEntrySubmitActivity({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                activityId: command.metadata.activityId!,
                activityTitle: command.metadata.activityTitle!,
            });
        case LogEntryType.PUBLISH_ACTIVITY:
            return new LogEntryPublishActivity({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                activityId: command.metadata.activityId!,
                activityTitle: command.metadata.activityTitle!,
            });
        case LogEntryType.TANDEM_CHAT:
            return new LogEntryTandemChat({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                conversationId: command.metadata.conversationId!,
                tandemFirstname: command.metadata.tandemFirstname!,
                tandemLastname: command.metadata.tandemLastname!,
            });
        case LogEntryType.VISIO:
            return new LogEntryVisio({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                duration: command.metadata.duration!,
                tandemFirstname: command.metadata.tandemFirstname!,
                tandemLastname: command.metadata.tandemLastname!,
            });
        default:
            return undefined;
    }
};

export default LogEntryCommand;
