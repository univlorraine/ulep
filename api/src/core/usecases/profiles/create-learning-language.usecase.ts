import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  RessourceDoesNotExist,
  UnsuportedLanguageException,
} from 'src/core/errors';
import {
  LanguageStatus,
  LearningLanguage,
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
    console.log('command', command);

    const profile = await this.profilesRepository.ofId(command.profileId);
    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }

    // TODO(NOW): assert no more than 3 learning languages

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

    const item = new LearningLanguage({
      id: this.uuidProvider.generate(),
      language,
      level: command.level,
      profile: profile,
    });

    await this.learningLanguageRepository.create(item);

    return item;
  }
}
