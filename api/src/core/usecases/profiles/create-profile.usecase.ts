import { Inject, Injectable, Logger } from '@nestjs/common';
import {
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

export class CreateProfileCommand {
  id: string;
  userId: string;
  age: number;
  role: Role;
  gender: Gender;
  university: string;
  learningLanguage: string;
  proficiencyLevel: CEFRLevel;
  nativeLanguage: string;
  learningType: 'ETANDEM' | 'TANDEM' | 'BOTH';
  goals: Goal[];
  meetingFrequency: MeetingFrequency;
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

    const learningLanguage = await this.tryToFindTheLanguageOfCode(
      command.learningLanguage,
    );

    // If the university does not support the learning language, throw an error
    if (!university.languages.includes(learningLanguage)) {
      throw LanguageDoesNotExist.withCodeOf(learningLanguage.code);
    }

    const nativeLanguage = await this.tryToFindTheLanguageOfCode(
      command.nativeLanguage,
    );

    const instance = new Profile({
      id: command.id,
      user,
      role: command.role,
      university,
      personalInformation: {
        age: command.age,
        gender: command.gender,
        interests: new Set(command.interests),
        bio: command.bios,
      },
      languages: {
        nativeLanguage: nativeLanguage.code,
        masteredLanguages: [],
        learningLanguage: learningLanguage.code,
        learningLanguageLevel: command.proficiencyLevel,
      },
      preferences: {
        learningType: command.learningType,
        meetingFrequency: command.meetingFrequency,
        sameGender: command.preferSameGender,
        goals: new Set(command.goals),
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

  private async tryToFindTheLanguageOfCode(code: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(code);
    if (!language) {
      throw LanguageDoesNotExist.withCodeOf(code);
    }

    return language;
  }
}
