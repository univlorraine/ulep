import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { ProficiencyLevel } from 'src/core/models';
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
import { UploadAudioVocabularyUsecase } from 'src/core/usecases/media';

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
//TODO: on url generate scratch infos
@Injectable()
export class CreateActivityUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(UploadAudioVocabularyUsecase)
    private readonly uploadAudioVocabularyUsecase: UploadAudioVocabularyUsecase,
  ) {}

  async execute(command: CreateActivityCommand) {
    await this.assertLanguageExist(command.languageCode);
    await this.assertProfileExist(command.profileId);
    await this.assertThemeExist(command.themeId);

    const activity = await this.activityRepository.createActivity({
      title: command.title,
      description: command.description,
      profileId: command.profileId,
      themeId: command.themeId,
      exercises: command.exercises,
      languageLevel: command.languageLevel,
      languageCode: command.languageCode,
    });

    for (const vocabulary of command.vocabularies) {
      await this.createVocabularyForActivity(
        activity.id,
        vocabulary.content,
        vocabulary.pronunciation,
      );
    }

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
      const audioUrl = await this.uploadAudioVocabularyUsecase.execute({
        vocabularyId: vocabulary.id,
        file: pronunciation,
        isTranslation: false,
      });

      vocabulary.pronunciationActivityVocabularyUrl = audioUrl;
    }
  }
}
