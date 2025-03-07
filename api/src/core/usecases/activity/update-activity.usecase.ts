import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { ProficiencyLevel } from 'src/core/models';
import {
  Activity,
  ActivityStatus,
  ActivityVocabulary,
} from 'src/core/models/activity.model';
import { LogEntryType } from 'src/core/models/log-entry.model';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
  UpdateActivityVocabularyProps,
} from 'src/core/ports/activity.repository';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  MediaObjectRepository,
  MEDIA_OBJECT_REPOSITORY,
} from 'src/core/ports/media-object.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry';
import {
  DeleteAudioVocabularyActivityUsecase,
  UploadAudioVocabularyActivityUsecase,
} from 'src/core/usecases/media';
const ogs = require('open-graph-scraper');

export class UpdateActivityCommand {
  id: string;
  title?: string;
  status?: ActivityStatus;
  description?: string;
  themeId?: string;
  exercises?: { content: string; order: number }[];
  vocabularies?: UpdateActivityVocabularyProps[];
  languageLevel?: ProficiencyLevel;
  languageCode?: string;
  ressourceUrl?: string;
  creditImage?: string;
}

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

@Injectable()
export class UpdateActivityUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(UploadAudioVocabularyActivityUsecase)
    private readonly uploadAudioVocabularyActivityUsecase: UploadAudioVocabularyActivityUsecase,
    @Inject(DeleteAudioVocabularyActivityUsecase)
    private readonly deleteAudioVocabularyActivityUsecase: DeleteAudioVocabularyActivityUsecase,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
  ) {}

  async execute(command: UpdateActivityCommand) {
    if (command.languageCode) {
      await this.assertLanguageExist(command.languageCode);
    }
    if (command.themeId) {
      await this.assertThemeExist(command.themeId);
    }

    const activity = await this.activityRepository.ofId(command.id);

    if (!activity) {
      throw new RessourceDoesNotExist('Activity does not exist');
    }

    if (activity.status === ActivityStatus.PUBLISHED) {
      throw new ForbiddenException('Activity is already published');
    }

    let openGraphResult: any;
    console.log('ressourceUrl', command.ressourceUrl);
    const urlWithProtocol =
      command.ressourceUrl &&
      (command.ressourceUrl.startsWith('http')
        ? command.ressourceUrl
        : `https://${command.ressourceUrl}`);

    const url =
      urlWithProtocol && URL_REGEX.test(urlWithProtocol)
        ? urlWithProtocol
        : undefined;

    console.log('url', url);
    if (url) {
      await this.handleDeleteRessourceFile(activity);
      try {
        const result = await ogs({ url });
        if (result.result.success) {
          openGraphResult = result.result;
        }
      } catch (err) {
        console.warn('Url not found for open graph', url);
      }
    }

    const updatedActivity = await this.activityRepository.updateActivity({
      id: command.id,
      title: command.title || activity.title,
      description: command.description || activity.description,
      themeId: command.themeId,
      exercises: command.exercises || activity.activityExercises,
      languageLevel: command.languageLevel || activity.languageLevel,
      languageCode: command.languageCode,
      ressourceUrl: command.ressourceUrl || activity.ressourceUrl,
      creditImage: command.creditImage || activity.creditImage,
      metadata: {
        openGraph: openGraphResult,
      },
    });

    const learningLanguage = activity.creator?.findLearningLanguageByCode(
      activity.language.code,
    );

    if (learningLanguage) {
      await this.createOrUpdateLogEntryUsecase.execute({
        learningLanguageId: learningLanguage.id,
        type: LogEntryType.EDIT_ACTIVITY,
        metadata: { activityId: command.id, activityTitle: command.title },
      });
    }

    // Remove vocabularies that are not in the command
    const vocabulariesToDelete = activity.activityVocabularies.filter(
      (vocabulary) =>
        vocabulary.id &&
        !command.vocabularies?.some((v) => v.id === vocabulary.id),
    );

    for (const vocabulary of vocabulariesToDelete) {
      await this.deleteVocabulary(vocabulary.id);
    }

    const activityVocabularies: ActivityVocabulary[] =
      activity.activityVocabularies;
    if (command.vocabularies) {
      for (const vocabulary of command.vocabularies) {
        activityVocabularies.push(
          await this.handleVocabularyUpdate(updatedActivity.id, vocabulary),
        );
      }
    }

    for (const vocabulary of activity.activityVocabularies) {
      if (
        vocabulary.pronunciationActivityVocabulary &&
        !vocabulary.pronunciationActivityVocabularyUrl
      ) {
        const audioUrl = await this.storage.temporaryUrl(
          vocabulary.pronunciationActivityVocabulary.bucket,
          vocabulary.pronunciationActivityVocabulary.name,
          3600,
        );
        vocabulary.pronunciationActivityVocabularyUrl = audioUrl;
      }
    }

    updatedActivity.activityVocabularies = activityVocabularies;

    return updatedActivity;
  }

  private async assertLanguageExist(code: string) {
    const language = await this.languageRepository.ofCode(code.toLowerCase());

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }

  private async assertThemeExist(id: string) {
    const theme = await this.activityRepository.ofThemeId(id);

    if (!theme) {
      throw new RessourceDoesNotExist('Theme does not exist');
    }
  }

  private async handleVocabularyUpdate(
    activityId: string,
    vocabulary: UpdateActivityVocabularyProps,
  ) {
    let newVocabulary: ActivityVocabulary;
    if (vocabulary.id) {
      newVocabulary = await this.updateVocabulary(
        vocabulary.id,
        vocabulary.content,
        vocabulary.pronunciation,
        vocabulary.pronunciationUrl,
      );
    } else {
      newVocabulary = await this.createVocabularyForActivity(
        activityId,
        vocabulary.content,
        vocabulary.pronunciation,
      );
    }
    return newVocabulary;
  }

  private async updateVocabulary(
    vocabularyId: string,
    content: string,
    pronunciation?: Express.Multer.File,
    pronunciationUrl?: string,
  ) {
    const vocabularyToUpdate =
      await this.activityRepository.ofVocabularyId(vocabularyId);

    if (!vocabularyToUpdate) {
      return;
    }

    let newVocabulary: ActivityVocabulary;
    // Update content if it has changed
    if (content !== vocabularyToUpdate.content) {
      newVocabulary = await this.activityRepository.updateVocabulary(
        vocabularyToUpdate.id,
        content,
      );
    } else {
      newVocabulary = vocabularyToUpdate;
    }

    // Delete old pronunciation if needed ( no url )
    if (
      vocabularyToUpdate.pronunciationActivityVocabulary &&
      !pronunciationUrl
    ) {
      await this.deleteAudioVocabularyActivityUsecase.execute({
        vocabularyId: newVocabulary.id,
      });
    }

    // Upload new   pronunciation if it has changed
    if (pronunciation) {
      const audioUrl = await this.uploadAudioVocabularyActivityUsecase.execute({
        vocabularyId: newVocabulary.id,
        file: pronunciation,
      });

      newVocabulary.pronunciationActivityVocabularyUrl = audioUrl;
    }

    return newVocabulary;
  }

  private async createVocabularyForActivity(
    activityId: string,
    content: string,
    pronunciation?: Express.Multer.File,
  ) {
    const vocabulary =
      await this.activityRepository.createVocabularyForActivity(
        activityId,
        content,
      );
    if (pronunciation) {
      const audioUrl = await this.uploadAudioVocabularyActivityUsecase.execute({
        vocabularyId: vocabulary.id,
        file: pronunciation,
      });

      vocabulary.pronunciationActivityVocabularyUrl = audioUrl;
    }

    return vocabulary;
  }

  private async deleteVocabulary(vocabularyId: string) {
    await this.deleteAudioVocabularyActivityUsecase.execute({
      vocabularyId,
    });
    await this.activityRepository.deleteVocabulary(vocabularyId);
  }

  private async handleDeleteRessourceFile(activity: Activity) {
    console.log('activity', activity);
    if (activity.ressourceFile) {
      await this.mediaObjectRepository.remove(activity.ressourceFile.id);
      await this.storage.delete(
        activity.ressourceFile.bucket,
        activity.ressourceFile.name,
      );
    }
  }
}
