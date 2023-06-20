import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists } from 'src/core/errors/RessourceAlreadyExists';
import { Language } from 'src/core/models/language';
import { LanguageRepository } from 'src/core/ports/language.repository';
import { LANGUAGE_REPOSITORY } from 'src/providers/providers.module';

export class UpdateLanguageCommand {
  id: string;
  isEnable: boolean;
}

@Injectable()
export class UpdateLanguageUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateLanguageCommand): Promise<Language> {
    const { id, isEnable } = command;

    const language = await this.languageRepository.of(id);

    if (!language) {
      throw RessourceAlreadyExists.withIdOf('Language', id);
    }

    language.isEnable = isEnable;

    await this.languageRepository.save(language);

    return language;
  }
}
