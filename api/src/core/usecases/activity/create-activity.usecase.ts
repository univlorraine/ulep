import { Inject, Injectable } from '@nestjs/common';
import openGraphScraper from 'open-graph-scraper';
import { RessourceDoesNotExist } from 'src/core/errors';
import { ProficiencyLevel } from 'src/core/models';
import { ActivityVocabulary } from 'src/core/models/activity.model';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import { UploadAudioVocabularyActivityUsecase } from 'src/core/usecases/media';

export class CreateActivityCommand {
  title: string;
  description: string;
  profileId: string;
  themeId: string;
  exercises: { content: string; order: number }[];
  vocabularies: { content: string; pronunciation?: Express.Multer.File }[];
  languageLevel: ProficiencyLevel;
  languageCode: string;
  ressourceUrl?: string;
  creditImage?: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

@Injectable()
export class CreateActivityUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(UploadAudioVocabularyActivityUsecase)
    private readonly uploadAudioVocabularyActivityUsecase: UploadAudioVocabularyActivityUsecase,
  ) {}

  async execute(command: CreateActivityCommand) {
    await this.assertLanguageExist(command.languageCode);
    await this.assertProfileExist(command.profileId);
    await this.assertThemeExist(command.themeId);

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

    const activity = await this.activityRepository.createActivity({
      title: command.title,
      description: command.description,
      profileId: command.profileId,
      themeId: command.themeId,
      exercises: command.exercises,
      languageLevel: command.languageLevel,
      languageCode: command.languageCode,
      ressourceUrl: command.ressourceUrl,
      creditImage: command.creditImage,
      metadata: {
        openGraph: openGraphResult,
      },
    });

    const activityVocabularies: ActivityVocabulary[] = [];
    if (command.vocabularies) {
      for (const vocabulary of command.vocabularies) {
        activityVocabularies.push(
          await this.createVocabularyForActivity(
            activity.id,
            vocabulary.content,
            vocabulary.pronunciation,
          ),
        );
      }
    }

    activity.activityVocabularies = activityVocabularies;

    return activity;
  }

  private async assertLanguageExist(code: string) {
    const language = await this.languageRepository.ofCode(code.toLowerCase());

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }

  private async assertProfileExist(id: string) {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }

  private async assertThemeExist(id: string) {
    const theme = await this.activityRepository.ofThemeId(id);

    if (!theme) {
      throw new RessourceDoesNotExist('Theme does not exist');
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
