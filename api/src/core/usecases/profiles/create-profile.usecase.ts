import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  LanguageDoesNotExist,
  UniversityDoesNotExist,
  UserDoesNotExist,
} from '../../errors/RessourceDoesNotExist';
import { Gender, Role, Profile } from '../../models/profile';
import { ProfileRepository } from '../../ports/profile.repository';
import { UniversityRepository } from '../../ports/university.repository';
import {
  LANGUAGE_REPOSITORY,
  PROFILE_REPOSITORY,
  UNIVERSITY_REPOSITORY,
  USER_REPOSITORY,
} from '../../../providers/providers.module';
import { LanguageRepository } from '../../ports/language.repository';
import { University } from '../../models/university';
import { Language } from '../../models/language';
import { User } from '../../models/user';
import { UserRepository } from '../../ports/user.repository';
import { ProfileAlreadyExists } from '../../errors/RessourceAlreadyExists';
import { ProfileLanguagesException } from '../../errors/ProfileExceptions';
import { CEFRLevel } from 'src/core/models/cefr';

export class CreateProfileCommand {
  id: string;
  userId: string;
  age: number;
  role: Role;
  gender: Gender;
  university: string;
  learningLanguage?: string;
  proficiencyLevel: CEFRLevel;
  nativeLanguage: string;
  masteredLanguages?: string[];
  learningType: 'ETANDEM' | 'TANDEM' | 'BOTH';
  goals: string[];
  meetingFrequency: string;
  interests: string[];
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
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    const user = await this.tryToFindTheUserOfId(command.userId);
    await this.assertProfileDoesNotExistForUser(user);

    const university = await this.tryToFindTheUniversityOfId(
      command.university,
    );

    const nativeLanguage = await this.tryToFindTheLanguageOfCode(
      command.nativeLanguage,
    );

    let learningLanguage: Language | null = null;
    if (command.learningLanguage) {
      learningLanguage = await this.tryToFindTheLanguageOfCode(
        command.learningLanguage,
      );

      this.assertLearningLanguageIsSupportedByUniversity(
        university,
        learningLanguage,
      );
    }

    const instance = new Profile({
      id: command.id,
      user,
      role: command.role,
      university,
      personalInformation: {
        age: command.age,
        gender: command.gender,
        interests: command.interests,
        bio: command.bios,
      },
      languages: {
        nativeLanguage: nativeLanguage.code,
        masteredLanguages: command.masteredLanguages || [],
        learningLanguage: learningLanguage?.code,
        learningLanguageLevel: command.proficiencyLevel,
      },
      preferences: {
        learningType: command.learningType,
        meetingFrequency: command.meetingFrequency,
        sameGender: command.preferSameGender,
        goals: command.goals,
      },
    });

    this.logger.debug(JSON.stringify(instance.preferences.goals));

    await this.profileRepository.create(instance);

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

  private async tryToFindTheLanguageOfCode(code: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(code);
    if (!language) {
      throw LanguageDoesNotExist.withCodeOf(code);
    }

    return language;
  }

  private assertLearningLanguageIsSupportedByUniversity(
    university: University,
    language: Language,
  ): void {
    const languages = university.languages.map((language) =>
      language.code.toUpperCase(),
    );

    if (!languages.includes(language.code.toUpperCase())) {
      throw new ProfileLanguagesException(
        'Learning language is not supported by the university',
      );
    }
  }
}
