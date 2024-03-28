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
  TANDEM_HISTORY_REPOSITORY,
  TandemHistoryRepository,
} from 'src/core/ports/tandem-history.repository';
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
  sameTandem: boolean;
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
    @Inject(TANDEM_HISTORY_REPOSITORY)
    private readonly tandemHistoryRepository: TandemHistoryRepository,
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

    const maxTandemCount = profile.user.university.maxTandemsPerUser;
    const learningLanguagesCount = profile.learningLanguages.length;
    if (learningLanguagesCount >= maxTandemCount) {
      throw new ProfileHasMaxNumberOfLearningLanguages(
        `Profile already has ${learningLanguagesCount} learning languages`,
      );
    }

    const language = await this.languageRepository.ofCode(command.code);
    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    if (
      !language.isJokerLanguage() &&
      !profile.user.university.supportLanguage(language, command.learningType)
    ) {
      throw new UnsuportedLanguageException(
        `The language is not supported by the university`,
      );
    }

    if (
      !command.campusId &&
      (command.learningType === LearningType.TANDEM ||
        command.learningType === LearningType.BOTH)
    ) {
      throw new ProfileCampusException(
        'A campus is required for tandem / both learningType',
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

    const historizedUnmatchedLearningLanguage =
      await this.learningLanguageRepository.getHistoricUnmatchedLearningLanguageByUserIdAndLanguageId(
        profile.user.id,
        language.id,
      );

    let sameTandemEmail;
    if (command.sameTandem) {
      const historyTandem =
        await this.tandemHistoryRepository.getHistoryTandemFormUserIdAndLanguageId(
          profile.user.id,
          language.id,
        );
      sameTandemEmail =
        await this.tandemHistoryRepository.getOtherUserInTandemHistory(
          profile.user.id,
          historyTandem.tandemId,
        );
    }

    const item = new LearningLanguage({
      id: this.uuidProvider.generate(),
      language,
      level: command.level,
      profile: profile,
      learningType: command.learningType,
      sameGender: command.sameGender,
      sameAge: command.sameAge,
      sameTandemEmail,
      certificateOption: command.certificateOption,
      specificProgram: command.specificProgram,
      hasPriority: Boolean(historizedUnmatchedLearningLanguage),
      campus: campus,
    });

    await this.learningLanguageRepository.create(item);

    return item;
  }
}
