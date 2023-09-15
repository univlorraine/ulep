import { universityCommandToDomain } from './../../../../../app/src/command/UniversityCommand';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguageIsAlreadyInActiveTandemError } from 'src/core/errors/tandem-exceptions';
import {
  LearningLanguage,
  PairingMode,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';

export type CreateTandemCommand = {
  learningLanguageIds: string[];
  adminUniversityId?: string;
};

@Injectable()
export class CreateTandemUsecase {
  private readonly logger = new Logger(CreateTandemUsecase.name);

  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProvider,
  ) {}

  async execute(command: CreateTandemCommand): Promise<Tandem> {
    const learningLanguages = await Promise.all(
      command.learningLanguageIds.map((id) =>
        this.tryToFindLearningLanguages(id),
      ),
    );
    await Promise.all(
      learningLanguages.map((ll) =>
        this.assertLearningLanguageIsNotInActiveTandem(ll),
      ),
    );

    const adminUniversityId =
      command.adminUniversityId ??
      (await this.universityRepository.findUniversityCentral()).id;

    const {
      learningLanguagesFromAdminUniversity,
      learningLanguagesNotFromAdminUniversity,
    } = learningLanguages.reduce<{
      learningLanguagesFromAdminUniversity: LearningLanguage[];
      learningLanguagesNotFromAdminUniversity: LearningLanguage[];
    }>(
      (accumulator, ll) => {
        if (ll.profile.user.university.id === adminUniversityId) {
          accumulator.learningLanguagesFromAdminUniversity.push(ll);
        } else {
          accumulator.learningLanguagesNotFromAdminUniversity.push(ll);
        }
        return accumulator;
      },
      {
        learningLanguagesFromAdminUniversity: [],
        learningLanguagesNotFromAdminUniversity: [],
      },
    );

    let tandem: Tandem;
    if (learningLanguagesFromAdminUniversity.length === 0) {
      // TODO(NOW+1): custom errors ?
      throw new Error(
        'No concerned learning languages is from admin university',
      );
    } else if (
      learningLanguagesFromAdminUniversity.length === learningLanguages.length
    ) {
      tandem = Tandem.create({
        id: this.uuidProvider.generate(),
        learningLanguages,
        status: TandemStatus.ACTIVE,
        universityValidations: [adminUniversityId],
      });
    } else {
      const partnerUniversityPairingMode =
        learningLanguagesNotFromAdminUniversity[0].profile.user.university
          .pairingMode;

      switch (partnerUniversityPairingMode) {
        case PairingMode.MANUAL:
          tandem = Tandem.create({
            id: this.uuidProvider.generate(),
            learningLanguages,
            status: TandemStatus.VALIDATED_BY_ONE_UNIVERSITY,
            universityValidations: [adminUniversityId],
          });
          break;
        case PairingMode.SEMI_AUTOMATIC:
        case PairingMode.AUTOMATIC:
          tandem = Tandem.create({
            id: this.uuidProvider.generate(),
            learningLanguages,
            status: TandemStatus.ACTIVE,
            universityValidations: [adminUniversityId],
          });
          break;
        default:
          throw new Error(
            `Unsupported university pairing mode ${partnerUniversityPairingMode}`,
          );
      }
    }

    const countDeletedTandem =
      await this.tandemsRepository.deleteTandemLinkedToLearningLanguages(
        learningLanguages.map((ll) => ll.id),
      );
    this.logger.debug(
      `Removed ${countDeletedTandem} tandems linked to learning languages of created tandem`,
    );

    await this.tandemsRepository.save(tandem);
    this.logger.debug(
      `Tandem ${tandem.id} created with status ${tandem.status}`,
    );

    return tandem;
  }

  private async tryToFindLearningLanguages(id: string) {
    const LearningLanguage = await this.learningLanguageRepository.ofId(id);
    if (!LearningLanguage) {
      throw new RessourceDoesNotExist();
    }

    return LearningLanguage;
  }

  private async assertLearningLanguageIsNotInActiveTandem(
    learningLanguage: LearningLanguage,
  ): Promise<void> {
    const hasActiveTandem =
      await this.learningLanguageRepository.hasAnActiveTandem(
        learningLanguage.id,
      );

    if (hasActiveTandem) {
      throw new LearningLanguageIsAlreadyInActiveTandemError(
        learningLanguage.id,
      );
    }
  }
}
