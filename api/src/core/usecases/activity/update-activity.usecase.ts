import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import openGraphScraper from 'open-graph-scraper';
import { RessourceDoesNotExist } from 'src/core/errors';
import { ProficiencyLevel } from 'src/core/models';
import {
  ActivityStatus,
  ActivityVocabulary,
} from 'src/core/models/activity.model';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import {
  DeleteAudioVocabularyActivityUsecase,
  UploadAudioVocabularyActivityUsecase,
} from 'src/core/usecases/media';

export class UpdateActivityCommand {
  id: string;
  title?: string;
  status?: ActivityStatus;
  description?: string;
  themeId?: string;
  exercises?: { content: string; order: number }[];
  vocabularies?: { content: string; pronunciation?: Express.Multer.File }[];
  vocabulariesToDelete?: string[];
  languageLevel?: ProficiencyLevel;
  languageCode?: string;
  ressourceUrl?: string;
  creditImage?: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

@Injectable()
export class UpdateActivityUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(UploadAudioVocabularyActivityUsecase)
    private readonly uploadAudioVocabularyActivityUsecase: UploadAudioVocabularyActivityUsecase,
    @Inject(DeleteAudioVocabularyActivityUsecase)
    private readonly deleteAudioVocabularyActivityUsecase: DeleteAudioVocabularyActivityUsecase,
  ) {}

  async execute(command: UpdateActivityCommand) {
    await this.assertLanguageExist(command.languageCode);
    await this.assertThemeExist(command.themeId);

    const activity = await this.activityRepository.ofId(command.id);

    if (!activity) {
      throw new RessourceDoesNotExist('Activity does not exist');
    }

    if (activity.status === ActivityStatus.PUBLISHED) {
      throw new ForbiddenException('Activity is already published');
    }

    if (
      command.vocabulariesToDelete &&
      command.vocabulariesToDelete.length > 0
    ) {
      await this.deleteVocabularies(command.vocabulariesToDelete);
    }

    let openGraphResult: any;
    const url = command.ressourceUrl
      ? command.ressourceUrl.match(URL_REGEX)?.[0]
      : undefined;
    if (url) {
      try {
        const result = await openGraphScraper({ url });
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
      status: command.status || activity.status,
      description: command.description || activity.description,
      themeId: command.themeId || activity.activityTheme.id,
      exercises: command.exercises || activity.activityExercises,
      languageLevel: command.languageLevel || activity.languageLevel,
      languageCode: command.languageCode || activity.language.id,
      ressourceUrl: command.ressourceUrl || activity.ressourceUrl,
      creditImage: command.creditImage || activity.creditImage,
      metadata: openGraphResult
        ? {
            openGraph: openGraphResult,
          }
        : activity.metadata,
    });

    const activityVocabularies: ActivityVocabulary[] =
      activity.activityVocabularies;
    if (command.vocabularies) {
      for (const vocabulary of command.vocabularies) {
        activityVocabularies.push(
          await this.createVocabularyForActivity(
            updatedActivity.id,
            vocabulary.content,
            vocabulary.pronunciation,
          ),
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

  private async deleteVocabularies(vocabulariesToDelete: string[]) {
    for (const vocabularyId of vocabulariesToDelete) {
      const vocabulary = await this.activityRepository.ofVocabularyId(
        vocabularyId,
      );
      if (vocabulary && vocabulary.pronunciationActivityVocabulary) {
        await this.deleteAudioVocabularyActivityUsecase.execute({
          vocabularyId: vocabulary.id,
        });
      }
      await this.activityRepository.deleteVocabulary(vocabularyId);
    }
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
}
