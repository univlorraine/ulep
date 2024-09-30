import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists, RessourceDoesNotExist } from 'src/core/errors';
import { Translation } from 'src/core/models';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';

export class CreateActivityThemeCategoryCommand {
  name: string;
  languageCode: string;
  translations: Translation[];
}
@Injectable()
export class CreateActivityThemeCategoryUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateActivityThemeCategoryCommand) {
    const activityThemeCategory =
      await this.activityRepository.ofCategoryThemeName(command.name);
    if (activityThemeCategory) {
      throw new RessourceAlreadyExists();
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return this.activityRepository.createThemeCategory({
      content: command.name,
      languageCode: command.languageCode,
      translations: command.translations,
    });
  }
}
