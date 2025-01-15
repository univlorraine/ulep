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

export class CreateActivityThemeCommand {
  categoryId: string;
  content: string;
  languageCode: string;
  translations: Translation[];
}
@Injectable()
export class CreateActivityThemeUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateActivityThemeCommand) {
    const activityTheme =
      await this.activityRepository.ofThemeNameAndCategoryId(
        command.categoryId,
        command.content,
      );
    if (activityTheme) {
      throw new RessourceAlreadyExists();
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return this.activityRepository.createTheme({
      categoryId: command.categoryId,
      content: command.content,
      languageCode: command.languageCode,
      translations: command.translations,
    });
  }
}
