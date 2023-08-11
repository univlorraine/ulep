import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  DomainErrorCode,
  RessourceAlreadyExists,
  RessourceDoesNotExist,
} from 'src/core/errors';
import { ProfileCampusException } from 'src/core/errors/profile-exceptions';
import { UnsuportedLanguageException } from 'src/core/errors/unsuported-language.exception';
import {
  Interest,
  JOKER_LANGUAGE_CODE,
  Language,
  LearningObjective,
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
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreateProfileCommand {
  user: string;
  nativeLanguageCode: string;
  masteredLanguageCodes?: string[];
  learningLanguages: {
    code: string;
    level: ProficiencyLevel;
  }[];
  learningType: LearningType;
  objectives: string[];
  meetingFrequency: string;
  interests: string[];
  sameGender: boolean;
  sameAge: boolean;
  bios?: string;
  campusId?: string;
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
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    const user = await this.tryToFindTheUserOfId(command.user);

    await this.assertProfileDoesNotExistForUser(user.id);

    if (command.learningType === LearningType.TANDEM && !command.campusId) {
      throw new ProfileCampusException(
        'A campus is required for tandem learningType',
      );
    }

    const campus = user.university.campus.find(
      (campus) => campus.id === command.campusId,
    );
    if (!campus) {
      throw new ProfileCampusException(
        `${command.campusId} not part of user's university`,
      );
    }

    const interests = await Promise.all(
      command.interests.map((id) => this.tryToFindTheInterestOfId(id)),
    );

    const nativeLanguage = await this.tryToFindTheLanguageOfCode(
      command.nativeLanguageCode,
    );

    const masteredLanguages = await Promise.all(
      (command.masteredLanguageCodes ?? []).map((code) =>
        this.tryToFindTheLanguageOfCode(code),
      ),
    );

    const learningLanguages = await Promise.all(
      command.learningLanguages.map(async (learningLanguage) => {
        const language = await this.tryToFindTheLanguageOfCode(
          learningLanguage.code,
        );

        if (learningLanguage.code !== JOKER_LANGUAGE_CODE) {
          this.assertLanguageIsSupportedByUniversity(
            user.university,
            learningLanguage.code,
          );
        }

        return {
          language,
          level: learningLanguage.level,
        };
      }),
    );

    const objectives = await Promise.all(
      command.objectives.map((id) => this.tryToFindTheObjectiveOfId(id)),
    );

    const profile = new Profile({
      ...command,
      id: this.uuidProvider.generate(),
      user: user,
      nativeLanguage,
      masteredLanguages,
      learningLanguages,
      objectives,
      interests,
      campus,
    });

    await this.profilesRepository.create(profile);

    return profile;
  }

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const user = await this.usersRepository.ofId(id);
    if (!user) {
      throw new RessourceDoesNotExist('User does not exist');
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
      throw new RessourceDoesNotExist('Interest does not exist');
    }

    return interest;
  }

  private async tryToFindTheLanguageOfCode(code: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(code.toLowerCase());
    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
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

  private async tryToFindTheObjectiveOfId(
    id: string,
  ): Promise<LearningObjective> {
    const objective = await this.objectiveRepository.ofId(id);
    if (!objective) {
      throw new RessourceDoesNotExist(
        'The objective does not exist',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    return objective;
  }
}
