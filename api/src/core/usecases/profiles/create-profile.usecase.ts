import { Inject, Injectable, Logger } from '@nestjs/common';
import { Gender, Role } from '@prisma/client';
import { ProfileAlreadyExists } from '../../errors/RessourceAlreadyExists';
import {
  CountryDoesNotExist,
  LanguageDoesNotExist,
  UniversityDoesNotExist,
} from '../../errors/RessourceDoesNotExist';
import {
  Goal,
  LanguageLevel,
  MeetingFrequency,
  Profile,
} from '../../models/profile';
import { CountryRepository } from '../../ports/country.repository';
import { ProfileRepository } from '../../ports/profile.repository';
import { UniversityRepository } from '../../ports/university.repository';
import {
  COUNTRY_REPOSITORY,
  LANGUAGE_REPOSITORY,
  PROFILE_REPOSITORY,
  UNIVERSITY_REPOSITORY,
} from '../../../providers/providers.module';
import { EventBus } from '@nestjs/cqrs';
import { NewProfileCreatedEvent } from 'src/core/events/NewProfileCreatedEvent';
import { LanguageRepository } from 'src/core/ports/language.repository';
import { University } from 'src/core/models/university';
import { Country } from 'src/core/models/country';
import { Language } from 'src/core/models/language';

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
  learningLanguage: string;
  proficiencyLevel: LanguageLevel;
  nativeLanguage: string;
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
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    await this.assertProfileDoesNotExistWithEmail(command.email);

    const university = await this.tryToFindTheUniversityOfId(
      command.university,
    );

    const nationality = await this.tryToFindTheCountryOfId(command.nationality);

    const learningLanguage = await this.tryToFindTheLanguageOfId(
      command.learningLanguage,
    );

    const nativeLanguage = await this.tryToFindTheLanguageOfId(
      command.nativeLanguage,
    );

    const instance = new Profile({
      ...command,
      university,
      nationality,
      learningLanguage: {
        id: learningLanguage.id,
        code: learningLanguage.code,
        proficiencyLevel: command.proficiencyLevel,
      },
      nativeLanguage: {
        id: nativeLanguage.id,
        code: nativeLanguage.code,
      },
    });

    await this.profileRepository.save(instance);

    this.eventBus.publish(NewProfileCreatedEvent.fromProfile(instance));

    return instance;
  }

  private async assertProfileDoesNotExistWithEmail(
    email: string,
  ): Promise<void> {
    const profile = await this.profileRepository.ofEmail(email);
    if (profile) {
      throw ProfileAlreadyExists.withEmailOf(email);
    }
  }

  private async tryToFindTheUniversityOfId(id: string): Promise<University> {
    const university = await this.universityRepository.ofId(id);
    if (!university) {
      throw UniversityDoesNotExist.withIdOf(id);
    }

    return university;
  }

  private async tryToFindTheCountryOfId(id: string): Promise<Country> {
    const country = await this.countryRepository.of(id);
    if (!country) {
      throw CountryDoesNotExist.withIdOf(id);
    }

    return country;
  }

  private async tryToFindTheLanguageOfId(id: string): Promise<Language> {
    const language = await this.languageRepository.of(id);
    if (!language) {
      throw LanguageDoesNotExist.withIdOf(id);
    }

    return language;
  }
}
