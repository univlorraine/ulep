import { Inject, Injectable } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { University } from 'src/core/models';
import { Campus } from 'src/core/models/campus.model';
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

export class CreateUniversityCommand {
  countryId: string;
  name: string;
  campusNames: string[];
  timezone: string;
  admissionStart: Date;
  admissionEnd: Date;
  website?: string;
  resourcesUrl?: string;
  confidentialityUrl?: string;
  termsOfUseUrl?: string;
  codes?: string[];
  domains?: string[];
}

@Injectable()
export class CreateUniversityUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateUniversityCommand) {
    const universities = await this.universityRepository.findAll();
    if (universities.items.length > 0) {
      throw new DomainError({ message: 'Central university already exists' });
    }

    const country = await this.countryRepository.ofId(command.countryId);

    if (!country) {
      throw new RessourceDoesNotExist('Country does not exist');
    }

    const instance = await this.universityRepository.ofName(command.name);
    if (instance) {
      throw new DomainError({ message: 'University name must be unique' });
    }

    const universityId = this.uuidProvider.generate();

    const university = University.create({
      id: universityId,
      name: command.name,
      parent: null,
      campus: command.campusNames.map(
        (campusName) =>
          new Campus({
            id: this.uuidProvider.generate(),
            name: campusName,
            universityId: universityId,
          }),
      ),
      country,
      timezone: command.timezone,
      admissionStart: command.admissionStart,
      admissionEnd: command.admissionEnd,
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
