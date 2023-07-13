import { Inject, Injectable } from '@nestjs/common';
import { LanguageRepository } from '../../ports/language.repository';
import { LANGUAGE_REPOSITORY } from '../../../providers/providers.module';
import { LanguageDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';

export class GetLanguageCommand {
  code: string;
}

@Injectable()
export class GetLanguageUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: GetLanguageCommand) {
    const result = await this.languageRepository.ofCode(command.code);

    if (!result) {
      throw LanguageDoesNotExist.withCodeOf(command.code);
    }

    return result;
  }
}
