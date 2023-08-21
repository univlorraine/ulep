import { Inject, Injectable } from '@nestjs/common';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
  SuggestedLanguageQueryOrderBy,
} from 'src/core/ports/language.repository';

export class FindAllSuggestedLanguageCommand {
  page: number;
  limit: number;
  orderBy?: SuggestedLanguageQueryOrderBy;
}

@Injectable()
export class FindAllSuggestedLanguageUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: FindAllSuggestedLanguageCommand) {
    const { page, orderBy, limit } = command;
    const offset = (page - 1) * limit;
    const languages = await this.languageRepository.allRequests(
      offset,
      limit,
      orderBy,
    );

    return languages;
  }
}
