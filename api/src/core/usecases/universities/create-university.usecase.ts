import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { University } from 'src/core/models/university';
import { CountryRepository } from 'src/core/ports/country.repository';
import { UniversityRepository } from 'src/core/ports/university.repository';
import {
  COUNTRY_REPOSITORY,
  UNIVERSITY_REPOSITORY,
} from 'src/providers/providers.module';

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
    const university = await this.universityRepository.findByName(command.name);
    if (university) {
      throw new BadRequestException({ message: 'University already exists' });
    }

    const country = await this.countryRepository.where({
      code: command.countryCode,
    });
    if (!country) {
      throw new BadRequestException({ message: 'Country not found' });
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
