import { Inject, Injectable } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { University } from 'src/core/models';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreateUniversityCommand {
  id: string;
  name: string;
  campus: string[];
  timezone: string;
  languages: string[];
  admissionStart: Date;
  admissionEnd: Date;
  website?: string;
  resourcesUrl?: string;
}

@Injectable()
export class CreateUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateUniversityCommand) {
    const universities = await this.universityRepository.findAll();
    if (universities.length > 0) {
      throw new DomainError({ message: 'Central university already exists' });
    }

    const instance = await this.universityRepository.ofName(command.name);
    if (instance) {
      throw new DomainError({ message: 'University name must be unique' });
    }

    const languageCodes = await Promise.all(
      command.languages.map((code) => this.tryToFindTheLanguageOfCode(code)),
    );

    const university = University.create({
      id: command.id,
      name: command.name,
      parent: null,
      campus: command.campus,
      timezone: command.timezone,
      languages: languageCodes.map((language) => ({
        id: this.uuidProvider.generate(),
        code: language.code,
        name: language.name,
      })),
      admissionStart: command.admissionStart,
      admissionEnd: command.admissionEnd,
      website: command.website,
      resourcesUrl: command.resourcesUrl,
    });

    return this.universityRepository.create(university);
  }

  private async tryToFindTheLanguageOfCode(code: string) {
    const language = await this.languageRepository.ofCode(code);
    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return language;
  }
}
