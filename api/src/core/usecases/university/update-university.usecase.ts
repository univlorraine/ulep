import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { RessourceAlreadyExists, RessourceDoesNotExist } from 'src/core/errors';
import { PairingMode, University } from 'src/core/models';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';

export class UpdateUniversityCommand {
  id: string;
  name: string;
  countryId: string;
  timezone: string;
  admissionEnd: Date;
  admissionStart: Date;
  codes: string[];
  domains: string[];
  website: string;
  pairingMode: PairingMode;
  notificationEmail?: string;
}

@Injectable()
export class UpdateUniversityUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UpdateUniversityCommand) {
    const university = await this.universityRepository.ofId(command.id);
    if (!university) {
      throw new RessourceDoesNotExist();
    }

    const country = await this.countryRepository.ofId(command.countryId);
    if (!country) {
      throw new RessourceAlreadyExists('Country does not exist');
    }

    return this.universityRepository.update(
      new University({
        id: university.id,
        name: command.name,
        country,
        codes: command.codes,
        domains: command.domains,
        timezone: command.timezone,
        admissionEnd: command.admissionEnd,
        admissionStart: command.admissionStart,
        campus: university.campus,
        website: command.website,
        pairingMode: command.pairingMode,
        notificationEmail: command.notificationEmail,
      }),
    );
  }
}
