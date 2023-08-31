import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from 'src/core/errors';
import { University } from 'src/core/models';
import { Campus } from 'src/core/models/campus.model';
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
  campusNames: string[];
  timezone: string;
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
    if (universities.items.length > 0) {
      throw new DomainError({ message: 'Central university already exists' });
    }

    const instance = await this.universityRepository.ofName(command.name);
    if (instance) {
      throw new DomainError({ message: 'University name must be unique' });
    }

    const university = University.create({
      id: command.id,
      name: command.name,
      parent: null,
      campus: command.campusNames.map(
        (campusName) =>
          new Campus({
            id: this.uuidProvider.generate(),
            name: campusName,
            universityId: command.id,
          }),
      ),
      timezone: command.timezone,
      admissionStart: command.admissionStart,
      admissionEnd: command.admissionEnd,
      website: command.website,
      resourcesUrl: command.resourcesUrl,
    });

    return this.universityRepository.create(university);
  }
}
