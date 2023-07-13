import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CountryDoesNotExist,
  LanguageDoesNotExist,
  UniversityDoesNotExist,
  UserDoesNotExist,
} from '../../errors/RessourceDoesNotExist';
import {
  Goal,
  Gender,
  Role,
  CEFRLevel,
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
  USER_REPOSITORY,
} from '../../../providers/providers.module';
import { LanguageRepository } from '../../ports/language.repository';
import { University } from '../../models/university';
import { Country } from '../../models/country';
import { Language } from '../../models/language';
import { User } from '../../models/user';
import { UserRepository } from '../../ports/user.repository';
import { ProfileAlreadyExists } from 'src/core/errors/RessourceAlreadyExists';

export class CreateProfileCommand {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  age: number;
  role: Role;
  gender: Gender;
  university: string;
  nationality: string;
  learningLanguage: string;
  proficiencyLevel: CEFRLevel;
  nativeLanguage: string;
  goals: Set<Goal>;
  meetingFrequency: MeetingFrequency;
  interests: Set<string>;
  preferSameGender: boolean;
  bios?: string;
}

@Injectable()
export class CreateProfileUsecase {
  private readonly logger = new Logger(CreateProfileUsecase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    const user = await this.tryToFindTheUserOfId(command.userId);
    await this.assertProfileDoesNotExistForUser(user);

    const university = await this.tryToFindTheUniversityOfId(
      command.university,
    );

    const nationality = await this.tryToFindTheCountryOfId(command.nationality);

    const learningLanguage = await this.tryToFindTheLanguageOfCode(
      command.learningLanguage,
    );

    const nativeLanguage = await this.tryToFindTheLanguageOfCode(
      command.nativeLanguage,
    );

    const instance = new Profile({
      ...command,
      user,
      university,
      nationality,
      nativeLanguage: {
        code: nativeLanguage.code,
      },
      learningLanguage: {
        code: learningLanguage.code,
      },
      learningLanguageLevel: command.proficiencyLevel,
      masteredLanguages: [],
      preferences: {
        meetingFrequency: command.meetingFrequency,
        sameGender: command.preferSameGender,
      },
    });

    await this.profileRepository.save(instance);

    return instance;
  }

  private async assertProfileDoesNotExistForUser(user: User): Promise<void> {
    const profile = await this.profileRepository.ofUser(user.id);
    if (profile) {
      throw ProfileAlreadyExists.withUserIdOf(user.id);
    }
  }

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const user = await this.userRepository.ofId(id);
    if (!user) {
      throw UserDoesNotExist.withIdOf(id);
    }

    return user;
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

  private async tryToFindTheLanguageOfCode(code: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(code);
    if (!language) {
      throw LanguageDoesNotExist.withCodeOf(code);
    }

    return language;
  }
}
