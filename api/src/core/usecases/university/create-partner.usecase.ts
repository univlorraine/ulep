import { Inject, Injectable } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { University } from 'src/core/models';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';
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
  countryId: string;
  name: string;
  timezone: string;
  website?: string;
  resourcesUrl?: string;
  confidentialityUrl?: string;
  termsOfUseUrl?: string;
  codes?: string[];
  domains?: string[];
}

@Injectable()
export class CreatePartnerUniversityUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
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

    const country = await this.countryRepository.ofId(command.countryId);

    if (!country) {
      throw new RessourceDoesNotExist('Country does not exist');
    }

    const oldUniversity = await this.universityRepository.ofName(command.name);
    if (oldUniversity) {
      throw new DomainError({ message: 'University name must be unique' });
    }

    const university = University.create({
      id: this.uuidProvider.generate(),
      name: command.name,
      parent: central.id,
      country,
      campus: [],
      timezone: command.timezone,
      admissionStart: central.admissionStart,
      admissionEnd: central.admissionEnd,
      website: command.website,
      resourcesUrl: command.resourcesUrl,
      codes: command.codes,
      domains: command.domains,
      confidentialityUrl: command.confidentialityUrl,
      termsOfUseUrl: command.termsOfUseUrl,
    });

    return this.universityRepository.create(university);
  }
}
