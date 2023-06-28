import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Gender, Role } from '@prisma/client';
import {
  CountryDoesNotExist,
  LanguageDoesNotExist,
  UniversityDoesNotExist,
  UserDoesNotExist,
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
  USER_REPOSITORY,
} from '../../../providers/providers.module';
import { EventBus } from '@nestjs/cqrs';
import { NewProfileCreatedEvent } from 'src/core/events/NewProfileCreatedEvent';
import { LanguageRepository } from 'src/core/ports/language.repository';
import { University } from 'src/core/models/university';
import { Country } from 'src/core/models/country';
import { Language } from 'src/core/models/language';
import { User } from 'src/core/models/user';
import { UserRepository } from 'src/core/ports/user.repository';

export class CreateProfileCommand {
  id: string;
  userId: string;
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
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    const user = await this.tryToFindTheUserOfId(command.userId);
    // TODO : check if the user is already linked to a profile

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

    if (nativeLanguage.id === learningLanguage.id) {
      throw new BadRequestException(
        'Native language and learning language cannot be the same',
      );
    }

    const instance = new Profile({
      ...command,
      user,
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
