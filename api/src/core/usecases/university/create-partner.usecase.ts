import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from 'src/core/errors';
import { University } from 'src/core/models';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreatePartnerUniversityCommand {
  id: string;
  name: string;
  campus: string[];
  timezone: string;
  admissionStart: Date;
  admissionEnd: Date;
  website?: string;
  resourcesUrl?: string;
}

@Injectable()
export class CreatePartnerUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) { }

  async execute(command: CreatePartnerUniversityCommand) {
    const rootUniversity = await this.universityRepository.findUniversityCentral();
    if (!rootUniversity) {
      throw new DomainError({ message: 'Central university does not exists' });
    }

    const instance = await this.universityRepository.ofName(command.name);
    if (instance) {
      throw new DomainError({ message: 'University name must be unique' });
    }

    const university = University.create({
      id: command.id,
      name: command.name,
      parent: rootUniversity.id,
      campus: command.campus,
      timezone: command.timezone,
      languages: rootUniversity.languages.map((language) => ({
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
}
