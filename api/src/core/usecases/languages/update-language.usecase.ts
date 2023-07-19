import { Inject, Injectable } from '@nestjs/common';
import { Language } from '../../models/language';
import { LanguageRepository } from '../../ports/language.repository';
import { LANGUAGE_REPOSITORY } from '../../../providers/providers.module';
import { LanguageDoesNotExist } from '../../errors/RessourceDoesNotExist';

export class UpdateLanguageCommand {
  code: string;
  name: string;
}

@Injectable()
export class UpdateLanguageUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateLanguageCommand): Promise<Language> {
    const { code } = command;

    const language = await this.tryToFindTheLanguageOfCode(code);

    language.name = command.name;

    await this.languageRepository.save(language);

    return language;
  }

  private async tryToFindTheLanguageOfCode(code: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(code);
    if (!language) {
      throw LanguageDoesNotExist.withCodeOf(code);
    }
    return language;
  }
}
