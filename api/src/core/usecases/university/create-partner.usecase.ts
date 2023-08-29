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
  parent: string;
  name: string;
  timezone: string;
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
  ) {}

  async execute(command: CreatePartnerUniversityCommand) {
    const central = await this.universityRepository.ofId(command.parent);
    if (!central) {
      throw new DomainError({ message: 'Central university does not exists' });
    }

    const instance = await this.universityRepository.ofName(command.name);
    if (instance) {
      throw new DomainError({ message: 'University name must be unique' });
    }

    const university = University.create({
      id: this.uuidProvider.generate(),
      name: command.name,
      parent: central.id,
      campus: [],
      timezone: command.timezone,
      admissionStart: central.admissionStart,
      admissionEnd: central.admissionEnd,
      website: command.website,
      resourcesUrl: command.resourcesUrl,
    });

    return this.universityRepository.create(university);
  }
}
