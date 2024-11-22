import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LogEntryMissingMetadataException } from 'src/core/errors/logs-entry.exception';
import {
  LogEntry,
  LogEntryAddVocabulary,
  LogEntryCommunityChat,
  LogEntryConnection,
  LogEntryEditActivity,
  LogEntryShareVocabulary,
  LogEntrySharingLogs,
  LogEntrySubmitActivity,
  LogEntryTandemChat,
  LogEntryType,
} from 'src/core/models/log-entry.model';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';

export type CreateOrUpdateLogEntryCommand = {
  type: LogEntryType;
  metadata: Record<string, any>;
  ownerId: string;
  createdAt?: Date;
};

type HandleEntryExistsTodayResult = {
  entryToUpdate: LogEntry;
  shouldCreate: boolean;
  shouldIgnore: boolean;
};

@Injectable()
export class CreateOrUpdateLogEntryUsecase {
  constructor(
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: CreateOrUpdateLogEntryCommand) {
    await this.assertProfileExists(command.ownerId);
    this.assertLogEntryMetadataIsValid(command.type, command.metadata);
    const action = await this.assertEntryExistsToday(
      command.type,
      command.metadata,
    );

    if (action.shouldIgnore) {
      return;
    } else if (action.entryToUpdate) {
      return this.logEntryRepository.update({
        ...command,
        id: action.entryToUpdate.id,
      });
    } else {
      return this.logEntryRepository.create({
        ...command,
        createdAt: command.createdAt,
      });
    }
  }

  private async assertEntryExistsToday(
    type: LogEntryType,
    metadata: Record<string, any>,
  ): Promise<HandleEntryExistsTodayResult> {
    const entries = await this.logEntryRepository.findAllOfTypeToday(type);

    switch (type) {
      case LogEntryType.ADD_VOCABULARY:
        const vocabularyEntryExistsToday = entries.find(
          (entry) =>
            entry instanceof LogEntryAddVocabulary &&
            entry.vocabularyListId === metadata.vocabularyListId,
        );

        return {
          entryToUpdate: vocabularyEntryExistsToday,
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
      case LogEntryType.CONNECTION:
        const connectionEntryExistsToday = entries.find(
          (entry) => entry instanceof LogEntryConnection,
        );

        return {
          entryToUpdate: undefined,
          shouldCreate: !connectionEntryExistsToday,
          shouldIgnore: Boolean(connectionEntryExistsToday),
        };
      case LogEntryType.CUSTOM_ENTRY:
      case LogEntryType.PLAYED_GAME:
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

  private async assertProfileExists(userId: string) {
    const profile = await this.profileRepository.ofUser(userId);
    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }

  private assertLogEntryMetadataIsValid(
    type: LogEntryType,
    metadata: Record<string, any>,
  ) {
    switch (type) {
      case LogEntryType.ADD_VOCABULARY:
        if (
          !metadata.vocabularyListId ||
          !metadata.entryNumber ||
          !metadata.vocabularyListName
        ) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.COMMUNITY_CHAT:
        if (!metadata.conversationId) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.CUSTOM_ENTRY:
        if (!metadata.content && !metadata.title) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.EDIT_ACTIVITY:
        if (!metadata.activityId || !metadata.updatedCount) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.PLAYED_GAME:
        if (!metadata.percentage) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.SHARE_VOCABULARY:
        if (!metadata.vocabularyListId || !metadata.vocabularyListName) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.SUBMIT_ACTIVITY:
        if (!metadata.activityId) {
          throw new LogEntryMissingMetadataException();
        }
        break;
      case LogEntryType.VISIO:
        if (
          !metadata.duration ||
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
      case LogEntryType.CONNECTION:
        break;
      default:
        break;
    }
  }
}
