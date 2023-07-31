import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists, RessourceDoesNotExist } from 'src/core/errors';
import { Language } from 'src/core/models';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreateLanguageCommand {
  university: string;
  code: string;
  name: string;
  countryCode?: string;
}

@Injectable()
export class CreateLanguageUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  // TODO: validate countryCode
  async execute(command: CreateLanguageCommand): Promise<Language> {
    const university = await this.universityRepository.ofId(command.university);
    if (!university) {
      throw new RessourceDoesNotExist();
    }

    const languageExists = university.languages.find(
      (language) => language.code === command.code,
    );

    if (languageExists) {
      throw new RessourceAlreadyExists();
    }

    const language: Language = {
      id: this.uuidProvider.generate(),
      code: command.code,
      name: command.name,
    };

    await this.universityRepository.addLanguage(language, university);

    return language;
  }
}
