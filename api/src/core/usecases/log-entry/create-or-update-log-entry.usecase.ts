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

import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LogEntryMissingMetadataException } from 'src/core/errors/logs-entry.exception';
import {
  LogEntryAddVocabulary,
  LogEntryCommunityChat,
  LogEntryEditActivity,
  LogEntryPlayedGame,
  LogEntryShareVocabulary,
  LogEntrySharingLogs,
  LogEntrySharingLogsForResearch,
  LogEntrySubmitActivity,
  LogEntryTandemChat,
  LogEntryType,
} from 'src/core/models/log-entry.model';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';

export type CreateOrUpdateLogEntryCommand = {
  type: LogEntryType;
  metadata: Record<string, any>;
  learningLanguageId: string;
  createdAt?: Date;
};

type HandleEntryExistsTodayResult = {
  entryToUpdate: { id: string; metadata: Record<string, any> };
  shouldCreate: boolean;
  shouldIgnore: boolean;
};

@Injectable()
export class CreateOrUpdateLogEntryUsecase {
  constructor(
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(command: CreateOrUpdateLogEntryCommand) {
    await this.assertLearningLanguageExists(command.learningLanguageId);
    this.assertLogEntryMetadataIsValid(command.type, command.metadata);
    const action = await this.assertEntryExistsToday(
      command.learningLanguageId,
      command.type,
      command.metadata,
    );

    if (action.shouldIgnore) {
      return;
    } else if (action.entryToUpdate) {
      return this.logEntryRepository.update({
        ...action.entryToUpdate,
      });
    } else {
      return this.logEntryRepository.create({
        ...command,
        createdAt: command.createdAt,
      });
    }
  }

  private async assertEntryExistsToday(
    learningLanguageId: string,
    type: LogEntryType,
    metadata: Record<string, any>,
  ): Promise<HandleEntryExistsTodayResult> {
    const entries =
      type === LogEntryType.TANDEM_CHAT
        ? await this.logEntryRepository.findAllOfType(
            learningLanguageId,
            type,
          )
        : await this.logEntryRepository.findAllOfTypeToday(
            learningLanguageId,
            type,
          );

    switch (type) {
      case LogEntryType.ADD_VOCABULARY:
        const vocabularyEntryExistsToday = entries.find(
          (entry) =>
            entry instanceof LogEntryAddVocabulary &&
            entry.vocabularyListId === metadata.vocabularyListId,
        ) as LogEntryAddVocabulary | undefined;

        return {
          entryToUpdate: vocabularyEntryExistsToday
            ? {
                id: vocabularyEntryExistsToday.id,
                metadata: {
                  vocabularyListId: metadata.vocabularyListId,
                  entryNumber: vocabularyEntryExistsToday.entryNumber
                    ? vocabularyEntryExistsToday.entryNumber + 1
                    : 1,
                  vocabularyListName: metadata.vocabularyListName,
                },
              }
            : undefined,
          shouldCreate: !vocabularyEntryExistsToday,
          shouldIgnore: false,
        };
      case LogEntryType.COMMUNITY_CHAT:
        const communityChatEntryExistsToday = entries.find(
          (entry) =>
            entry instanceof LogEntryCommunityChat &&
            entry.conversationId === metadata.conversationId,
        );
        return {
          entryToUpdate: undefined,
          shouldCreate: !communityChatEntryExistsToday,
          shouldIgnore: Boolean(communityChatEntryExistsToday),
        };
      case LogEntryType.EDIT_ACTIVITY:
        const editActivityEntryExistsToday = entries.find(
          (entry) =>
            entry instanceof LogEntryEditActivity &&
            entry.activityId === metadata.activityId,
        );
        return {
          entryToUpdate: undefined,
          shouldCreate: !editActivityEntryExistsToday,
          shouldIgnore: false,
        };
      case LogEntryType.SHARE_VOCABULARY:
        const shareVocabularyEntryExistsToday = entries.find(
          (entry) =>
            entry instanceof LogEntryShareVocabulary &&
            entry.vocabularyListId === metadata.vocabularyListId,
        );

        return {
          entryToUpdate: undefined,
          shouldCreate: !shareVocabularyEntryExistsToday,
          shouldIgnore: Boolean(shareVocabularyEntryExistsToday),
        };
      case LogEntryType.SUBMIT_ACTIVITY:
      case LogEntryType.PUBLISH_ACTIVITY:
        const submitActivityEntryExistsToday = entries.find(
          (entry) =>
            entry instanceof LogEntrySubmitActivity &&
            entry.activityId === metadata.activityId,
        );

        return {
          entryToUpdate: undefined,
          shouldCreate: !submitActivityEntryExistsToday,
          shouldIgnore: Boolean(submitActivityEntryExistsToday),
        };
      case LogEntryType.TANDEM_CHAT:
        const tandemChatEntryExistsToday = entries.find(
          (entry) =>
            entry instanceof LogEntryTandemChat &&
            entry.conversationId === metadata.conversationId,
        );

        return {
          entryToUpdate: undefined,
          shouldCreate: !tandemChatEntryExistsToday,
          shouldIgnore: Boolean(tandemChatEntryExistsToday),
        };
      case LogEntryType.VISIO:
        return {
          entryToUpdate: undefined,
          shouldCreate: true,
          shouldIgnore: undefined,
        };
      case LogEntryType.SHARING_LOGS:
        const sharingLogsEntryExistsToday = entries.find(
          (entry) => entry instanceof LogEntrySharingLogs,
        );

        return {
          entryToUpdate: undefined,
          shouldCreate: !sharingLogsEntryExistsToday,
          shouldIgnore: Boolean(sharingLogsEntryExistsToday),
        };
      case LogEntryType.SHARING_LOGS_FOR_RESEARCH:
        const sharingLogsForResearchEntryExistsToday = entries.find(
          (entry) => entry instanceof LogEntrySharingLogsForResearch,
        );

        return {
          entryToUpdate: undefined,
          shouldCreate: !sharingLogsForResearchEntryExistsToday,
          shouldIgnore: Boolean(sharingLogsForResearchEntryExistsToday),
        };

      case LogEntryType.PLAYED_GAME:
        const playedGameEntryExistsToday = entries.find(
          (entry) =>
            entry instanceof LogEntryPlayedGame &&
            entry.gameName === metadata.gameName,
        ) as LogEntryPlayedGame | undefined;

        return {
          entryToUpdate: playedGameEntryExistsToday
            ? {
                id: playedGameEntryExistsToday.id,
                metadata: {
                  gameName: playedGameEntryExistsToday.gameName,
                  totalCardPlayed:
                    playedGameEntryExistsToday.totalCardPlayed +
                    metadata.totalCardPlayed,
                  successCardPlayed:
                    playedGameEntryExistsToday.successCardPlayed +
                    metadata.successCardPlayed,
                },
              }
            : undefined,
          shouldCreate: !playedGameEntryExistsToday,
          shouldIgnore: false,
        };
      case LogEntryType.CUSTOM_ENTRY:
        return {
          entryToUpdate: undefined,
          shouldCreate: true,
          shouldIgnore: false,
        };
      default:
        return {
          entryToUpdate: undefined,
          shouldCreate: false,
          shouldIgnore: true,
        };
    }
  }

  private async assertLearningLanguageExists(learningLanguageId: string) {
    const learningLanguage =
      await this.learningLanguageRepository.ofId(learningLanguageId);
    if (!learningLanguage) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }

  private assertLogEntryMetadataIsValid(
    type: LogEntryType,
    metadata: Record<string, any>,
  ) {
    switch (type) {
      case LogEntryType.ADD_VOCABULARY:
        if (!metadata.vocabularyListId || !metadata.vocabularyListName) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.COMMUNITY_CHAT:
        if (!metadata.conversationId) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.CUSTOM_ENTRY:
        if (!metadata.title) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.EDIT_ACTIVITY:
        if (!metadata.activityId || !metadata.activityTitle) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.PLAYED_GAME:
        if (
          metadata.totalCardPlayed === undefined ||
          metadata.successCardPlayed === undefined ||
          !metadata.gameName
        ) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.SHARE_VOCABULARY:
        if (!metadata.vocabularyListId || !metadata.vocabularyListName) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.SUBMIT_ACTIVITY:
      case LogEntryType.PUBLISH_ACTIVITY:
        if (!metadata.activityId || !metadata.activityTitle) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.VISIO:
        if (
          !metadata.duration ||
          !metadata.roomName ||
          !metadata.partnerTandemId ||
          !metadata.tandemFirstname ||
          !metadata.tandemLastname
        ) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.TANDEM_CHAT:
        if (
          !metadata.partnerTandemId ||
          !metadata.tandemFirstname ||
          !metadata.tandemLastname
        ) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.SHARING_LOGS:
        break;
      default:
        break;
    }
  }
}
