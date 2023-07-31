import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceAlreadyExists, RessourceDoesNotExist } from 'src/core/errors';
import { UnsuportedLanguageException } from 'src/core/errors/unsuported-language.exception';
import {
  Interest,
  Language,
  LearningType,
  ProficiencyLevel,
  Profile,
  University,
  User,
} from 'src/core/models';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from 'src/core/ports/interest.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

export class CreateProfileCommand {
  id: string;
  user: string;
  nativeLanguageCode: string;
  learningLanguageCode?: string;
  proficiencyLevel: ProficiencyLevel;
  masteredLanguageCodes?: string[];
  learningType: LearningType;
  goals: string[]; // TODO validate and parse uuids
  meetingFrequency: string;
  interests: string[];
  sameGender: boolean;
  sameAge: boolean;
  bios?: string;
}

@Injectable()
export class CreateProfileUsecase {
  private readonly logger = new Logger(CreateProfileUsecase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(INTEREST_REPOSITORY)
    private readonly interestsRepository: InterestRepository,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    const user = await this.tryToFindTheUserOfId(command.user);

    await this.assertProfileDoesNotExistForUser(user.id);

    const interests = await Promise.all(
      command.interests.map((id) => this.tryToFindTheInterestOfId(id)),
    );

    const nativeLanguage = await this.tryToFindTheLanguageOfId(
      command.nativeLanguageCode,
    );

    const masteredLanguages = await Promise.all(
      (command.masteredLanguageCodes ?? []).map(this.tryToFindTheLanguageOfId),
    );

    let learningLanguage: Language | null = null;
    if (command.learningLanguageCode) {
      learningLanguage = await this.tryToFindTheLanguageOfId(
        command.learningLanguageCode,
      );

      this.assertLanguageIsSupportedByUniversity(
        user.university,
        learningLanguage.code,
      );
    }

    const profile = new Profile({
      id: command.id,
      user: user,
      languages: {
        native: nativeLanguage,
        learning: {
          id: learningLanguage?.id,
          code: learningLanguage?.code,
          level: command.proficiencyLevel,
        },
        mastered: masteredLanguages,
      },
      preferences: {
        learningType: command.learningType,
        goals: [], // TODO
        sameAge: command.sameAge,
        sameGender: command.sameGender,
        meetingFrequency: command.meetingFrequency,
      },
      interests: interests,
    });

    await this.profilesRepository.create(profile);

    return profile;
  }

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const user = await this.usersRepository.ofId(id);
    if (!user) {
      throw new RessourceDoesNotExist();
    }

    return user;
  }

  private async assertProfileDoesNotExistForUser(id: string): Promise<void> {
    const profile = await this.profilesRepository.ofUser(id);
    if (profile) {
      throw new RessourceAlreadyExists();
    }
  }

  private async tryToFindTheInterestOfId(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.interestOfId(id);
    if (!interest) {
      throw new RessourceDoesNotExist();
    }

    return interest;
  }

  private async tryToFindTheLanguageOfId(id: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(id);
    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return { ...language };
  }

  private assertLanguageIsSupportedByUniversity(
    university: University,
    languageCode: string,
  ): void {
    const languages = university.languages.map((language) =>
      language.code.toUpperCase(),
    );

    if (!languages.includes(languageCode.toUpperCase())) {
      throw new UnsuportedLanguageException(
        `The language is not supported by the university`,
      );
    }
  }
}
