import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LanguageStatus } from 'src/core/models';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';

export class UpdateLanguageCodeCommand {
  code: string;
  mainUniversityStatus?: LanguageStatus;
  secondaryUniversityActive?: boolean;
}

@Injectable()
export class UpdateLanguageCodeUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateLanguageCodeCommand) {
    const language = await this.languageRepository.ofCode(command.code);

    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return await this.languageRepository.update({
      ...language,
      mainUniversityStatus:
        command.mainUniversityStatus ?? language.mainUniversityStatus,
      secondaryUniversityActive:
        command.secondaryUniversityActive !== undefined
          ? command.secondaryUniversityActive
          : language.secondaryUniversityActive,
    });
  }
}
