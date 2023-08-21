import { Inject, Injectable } from '@nestjs/common';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';

export class CountAllSuggestedLanguageCommand {
  limit: number;
  page: number;
}

@Injectable()
export class CountAllSuggestedLanguageUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CountAllSuggestedLanguageCommand) {
    const { page, limit } = command;
    const offset = (page - 1) * limit;
    const suggestedLanguagesCount =
      await this.languageRepository.countAllRequests(offset, limit);

    return suggestedLanguagesCount;
  }
}
