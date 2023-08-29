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
    const languages = await this.languageRepository.all(
      command.orderBy,
      command.status,
    );
    return new Collection<Language>({
      items: languages.items.filter(
        (language) => language.code !== JOKER_LANGUAGE_CODE,
      ),
      totalItems: languages.totalItems,
    });
  }
}
