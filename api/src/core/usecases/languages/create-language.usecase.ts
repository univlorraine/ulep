import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists } from 'src/core/errors/RessourceAlreadyExists';
import { Language } from 'src/core/models/language';
import { LanguageRepository } from 'src/core/ports/language.repository';
import { LANGUAGE_REPOSITORY } from 'src/providers/providers.module';

export class CreateLanguageCommand {
  id: string;
  code: string;
  name: string;
  isEnable: boolean;
}

@Injectable()
export class CreateLanguageUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateLanguageCommand): Promise<Language> {
    const language = await this.languageRepository.where({
      code: command.code,
    });

    if (language) {
      throw new RessourceAlreadyExists('Language', 'code', command.code);
    }

    const instance = new Language({ ...command });

    await this.languageRepository.save(instance);

    return instance;
  }
}
