import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Translation } from 'src/core/models';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';

export class UpdateActivityThemeCategoryCommand {
  id: string;
  content: string;
  languageCode: string;
  translations?: Translation[];
}
@Injectable()
export class UpdateActivityThemeCategoryUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateActivityThemeCategoryCommand) {
    const activityThemeCategory =
      await this.activityRepository.ofCategoryThemeId(command.id);
    if (!activityThemeCategory) {
      throw new RessourceDoesNotExist();
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return this.activityRepository.updateThemeCategory({
      id: command.id,
      textContentId: activityThemeCategory.content.id,
      content: command.content,
      languageCode: command.languageCode,
      translations: command.translations,
    });
  }
}
