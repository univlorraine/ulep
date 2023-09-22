import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguageIsAlreadyInActiveTandemError } from 'src/core/errors/tandem-exceptions';
import {
  LearningLanguage,
  PairingMode,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { EMAIL_TEMPLATE_IDS } from 'src/core/models/email-content.model';
import {
  EMAIL_TEMPLATE_REPOSITORY,
  EmailTemplateRepository,
} from 'src/core/ports/email-template.repository';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
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
    @Inject(EMAIL_TEMPLATE_REPOSITORY)
    private readonly emailTemplateRepository: EmailTemplateRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
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
      throw new DomainError({
        message: 'No concerned learning languages is from admin university',
      });
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
          throw new DomainError({
            message: `Unsupported university pairing mode ${partnerUniversityPairingMode}`,
          });
      }
    }

    const countDeletedTandem =
      await this.tandemsRepository.deleteTandemLinkedToLearningLanguages(
        learningLanguages.map((ll) => ll.id),
      );
    this.logger.verbose(
      `Removed ${countDeletedTandem} tandems linked to learning languages of created tandem`,
    );

    await this.tandemsRepository.save(tandem);
    this.logger.verbose(
      `Tandem ${tandem.id} created with status ${tandem.status}`,
    );

    if (tandem.status === TandemStatus.ACTIVE) {
      const [learningLanguage1, learningLanguage2] = tandem.learningLanguages;
      const emailContentProfile1 = await this.emailTemplateRepository.getEmail(
        EMAIL_TEMPLATE_IDS.TANDEM_BECOME_ACTIVE,
        learningLanguage1.profile.nativeLanguage.code,
        {
          firstname: learningLanguage1.profile.user.firstname,
          partnerFirstname: learningLanguage2.profile.user.firstname,
          partnerLastname: learningLanguage2.profile.user.lastname,
          universityName: learningLanguage1.profile.user.university.name,
        },
      );
      const emailContentProfile2 = await this.emailTemplateRepository.getEmail(
        EMAIL_TEMPLATE_IDS.TANDEM_BECOME_ACTIVE,
        learningLanguage2.profile.nativeLanguage.code,
        {
          firstname: learningLanguage2.profile.user.firstname,
          partnerFirstname: learningLanguage1.profile.user.firstname,
          partnerLastname: learningLanguage1.profile.user.lastname,
          universityName: learningLanguage2.profile.user.university.name,
        },
      );
      await this.emailGateway.send({
        recipient: learningLanguage1.profile.user.email,
        email: emailContentProfile1,
      });
      await this.emailGateway.send({
        recipient: learningLanguage2.profile.user.email,
        email: emailContentProfile2,
      });
    }

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
