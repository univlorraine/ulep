import { Inject, Injectable } from '@nestjs/common';
import { Language } from '../../models/language';
import { LanguageRepository } from '../../ports/language.repository';
import { LANGUAGE_REPOSITORY } from '../../../providers/providers.module';
import { LanguageDoesNotExist } from '../../errors/RessourceDoesNotExist';

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

    const language = await this.languageRepository.ofId(id);

    if (!language) {
      throw LanguageDoesNotExist.withIdOf(id);
    }

    language.isEnable = isEnable;

    await this.languageRepository.save(language);

    return language;
  }
}
