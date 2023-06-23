import { Inject, Injectable } from '@nestjs/common';
import { University } from '../../models/university';
import { CountryRepository } from '../../ports/country.repository';
import { UniversityRepository } from '../../ports/university.repository';
import {
  COUNTRY_REPOSITORY,
  UNIVERSITY_REPOSITORY,
} from '../../../providers/providers.module';
import { UniversityAlreadyExists } from '../../errors/RessourceAlreadyExists';
import { CountryDoesNotExist } from '../../errors/RessourceDoesNotExist';

export class CreateUniversityCommand {
  name: string;
  timezone: string;
  countryCode: string;
  admissionStart: Date;
  admissionEnd: Date;
}

@Injectable()
export class CreateUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(command: CreateUniversityCommand): Promise<University> {
    const university = await this.universityRepository.ofName(command.name);
    if (university) {
      throw UniversityAlreadyExists.withNameOf(command.name);
    }

    const country = await this.countryRepository.where({
      code: command.countryCode,
    });
    if (!country) {
      throw CountryDoesNotExist.withCodeOf(command.countryCode);
    }

    const instance = University.create({
      name: command.name,
      timezone: command.timezone,
      country: country,
      admissionStart: command.admissionStart,
      admissionEnd: command.admissionEnd,
    });

    await this.universityRepository.save(instance);

    return instance;
  }
}
