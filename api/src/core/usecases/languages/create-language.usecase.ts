import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists } from '../../errors/RessourceAlreadyExists';
import { Language } from '../../models/language';
import { LanguageRepository } from '../../ports/language.repository';
import { LANGUAGE_REPOSITORY } from '../../../providers/providers.module';

export class CreateLanguageCommand {
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
    await this.assertLanguageDoesNotExistForCode(command.code);

    const instance = new Language({ ...command });

    await this.languageRepository.save(instance);

    return instance;
  }

  private async assertLanguageDoesNotExistForCode(code: string): Promise<void> {
    const language = await this.languageRepository.ofCode(code);
    if (language) {
      throw new RessourceAlreadyExists('Language', 'code', code);
    }
  }
}
