import { Inject, Injectable } from '@nestjs/common';
import {
  DomainErrorCode,
  RessourceAlreadyExists,
  RessourceDoesNotExist,
} from 'src/core/errors';
import { Language } from 'src/core/models';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class AddLanguageCommand {
  university: string;
  language: string;
}

@Injectable()
export class AddLanguageUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: AddLanguageCommand): Promise<Language> {
    const university = await this.universityRepository.ofId(command.university);
    if (!university) {
      throw new RessourceDoesNotExist('University does not exists');
    }

    const language = await this.languageRepository.ofId(command.language);
    if (!language) {
      throw new RessourceDoesNotExist(
        'Language does not exists',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    const languageExists = university.languages.find(
      (it) => language.id === it.id,
    );

    if (languageExists) {
      throw new RessourceAlreadyExists(
        'Language already exists',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    await this.universityRepository.addLanguage(language, university);

    return language;
  }
}
