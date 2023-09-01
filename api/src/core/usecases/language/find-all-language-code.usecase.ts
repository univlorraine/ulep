import { Collection } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { JOKER_LANGUAGE_CODE, Language } from 'src/core/models';
import {
  LANGUAGE_REPOSITORY,
  LanguageFilter,
  LanguageQueryOrderBy,
  LanguageRepository,
} from 'src/core/ports/language.repository';

export class FindAllLanguageCodeCommand {
  pagination?: boolean;
  limit?: number;
  page?: number;
  orderBy: LanguageQueryOrderBy;
  status?: LanguageFilter;
}

@Injectable()
export class FindAllLanguageCodeUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: FindAllLanguageCodeCommand) {
    const {
      pagination = true,
      page = 1,
      limit = 30,
      orderBy,
      status,
    } = command;
    const languages = await this.languageRepository.all(
      orderBy,
      status,
      pagination ? { page, limit } : undefined,
    );
    return new Collection<Language>({
      items: languages.items.filter(
        (language) => language.code !== JOKER_LANGUAGE_CODE,
      ),
      totalItems: languages.totalItems,
    });
  }
}
