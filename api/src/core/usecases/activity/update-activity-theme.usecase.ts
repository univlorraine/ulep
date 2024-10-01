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

export class UpdateActivityThemeCommand {
  id: string;
  content: string;
  languageCode?: string;
  translations?: Translation[];
}
@Injectable()
export class UpdateActivityThemeUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateActivityThemeCommand) {
    console.log({ command });
    const activityTheme = await this.activityRepository.ofThemeId(command.id);
    if (!activityTheme) {
      throw new RessourceDoesNotExist();
    }

    /*     const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist();
    } */

    return this.activityRepository.updateTheme({
      id: command.id,
      textContentId: activityTheme.content.id,
      content: command.content,
      languageCode: command.languageCode,
      translations: command.translations,
    });
  }
}
