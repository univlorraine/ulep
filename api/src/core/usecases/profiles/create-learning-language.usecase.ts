import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  RessourceDoesNotExist,
  UnsuportedLanguageException,
} from 'src/core/errors';
import {
  ProfileCampusException,
  ProfileHasMaxNumberOfLearningLanguages,
} from 'src/core/errors/profile-exceptions';
import {
  LanguageStatus,
  LearningLanguage,
  LearningType,
  ProficiencyLevel,
} from 'src/core/models';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export interface CreateLearningLanguageCommand {
  profileId: string;
  code: string;
  level: ProficiencyLevel;
  learningType: LearningType;
  sameGender: boolean;
  sameAge: boolean;
  campusId?: string;
  certificateOption?: boolean;
  specificProgram?: boolean;
}

@Injectable()
export class CreateLearningLanguageUseCase {
  private readonly logger = new Logger(CreateLearningLanguageUseCase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(
    command: CreateLearningLanguageCommand,
  ): Promise<LearningLanguage> {
    const profile = await this.profilesRepository.ofId(command.profileId);
    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }

    if (profile.learningLanguages.length >= 3) {
      throw new ProfileHasMaxNumberOfLearningLanguages(
        `Profile already has ${profile.learningLanguages.length} learning languages`,
      );
    }

    const language = await this.languageRepository.ofCode(command.code);
    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    if (!language.isJokerLanguage()) {
      if (
        (profile.user.university.parent &&
          !language.secondaryUniversityActive) ||
        (!profile.user.university.parent &&
          language.mainUniversityStatus !== LanguageStatus.PRIMARY)
      ) {
        throw new UnsuportedLanguageException(
          `The language is not supported by the university`,
        );
      }
    }

    if (command.learningType === LearningType.TANDEM && !command.campusId) {
      throw new ProfileCampusException(
        'A campus is required for tandem learningType',
      );
    }
    let campus;
    if (command.campusId) {
      campus = profile.user.university.campus.find(
        (campus) => campus.id === command.campusId,
      );
      if (!campus) {
        throw new ProfileCampusException(
          `${command.campusId} not part of user's university`,
        );
      }
    }

    const item = new LearningLanguage({
      id: this.uuidProvider.generate(),
      language,
      level: command.level,
      profile: profile,
      learningType: command.learningType,
      sameGender: command.sameGender,
      sameAge: command.sameAge,
      certificateOption: command.certificateOption,
      specificProgram: command.specificProgram,
      campus: campus,
    });

    await this.learningLanguageRepository.create(item);

    return item;
  }
}
