import { Inject, Injectable } from '@nestjs/common';
import { LanguageRepository } from '../../ports/language.repository';
import { LANGUAGE_REPOSITORY } from '../../../providers/providers.module';
import { LanguageDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';

export class GetLanguageCommand {
  id: string;
}

@Injectable()
export class GetLanguageUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: GetLanguageCommand) {
    const result = await this.languageRepository.ofId(command.id);

    if (!result) {
      throw LanguageDoesNotExist.withIdOf(command.id);
    }

    return result;
  }
}
