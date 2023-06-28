import { Inject, Injectable, Logger } from '@nestjs/common';
import { Gender, Role } from '@prisma/client';
import { ProfileAlreadyExists } from '../../errors/RessourceAlreadyExists';
import {
  CountryDoesNotExist,
  UniversityDoesNotExist,
} from '../../errors/RessourceDoesNotExist';
import { Goal, MeetingFrequency, Profile } from '../../models/profile';
import { CountryRepository } from '../../ports/country.repository';
import { ProfileRepository } from '../../ports/profile.repository';
import { UniversityRepository } from '../../ports/university.repository';
import {
  COUNTRY_REPOSITORY,
  PROFILE_REPOSITORY,
  UNIVERSITY_REPOSITORY,
} from '../../../providers/providers.module';

export class CreateProfileCommand {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  role: Role;
  gender: Gender;
  university: string;
  nationality: string;
  goals: Goal[];
  meetingFrequency: MeetingFrequency;
  bios?: string;
}

@Injectable()
export class CreateProfileUsecase {
  private readonly logger = new Logger(CreateProfileUsecase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    const profile = await this.profileRepository.ofEmail(command.email);
    if (profile) {
      throw ProfileAlreadyExists.withEmailOf(command.email);
    }

    const university = await this.universityRepository.ofId(command.university);
    if (!university) {
      throw UniversityDoesNotExist.withIdOf(command.university);
    }

    const nationality = await this.countryRepository.of(command.nationality);
    if (!nationality) {
      throw CountryDoesNotExist.withIdOf(command.nationality);
    }

    const instance = new Profile({ ...command, university, nationality });

    await this.profileRepository.save(instance);

    return instance;
  }
}
