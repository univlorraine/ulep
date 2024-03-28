import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguageIsAlreadyInActiveTandemError } from 'src/core/errors/tandem-exceptions';
import {
  LearningLanguage,
  PairingMode,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { IMatchScorer, MatchScorer } from 'src/core/services/MatchScorer';
import { UuidProvider } from 'src/providers/services/uuid.provider';

export type CreateTandemCommand = {
  learningLanguageIds: string[];
  adminUniversityId?: string;
};

@Injectable()
export class CreateTandemUsecase {
  private readonly scorer: IMatchScorer = new MatchScorer();
  private readonly logger = new Logger(CreateTandemUsecase.name);

  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProvider,
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

    const availableLanguages =
      await this.languageRepository.getLanguagesProposedToLearning();
    const compatibilityScore = this.scorer.computeMatchScore(
      learningLanguages[0],
      learningLanguages[1],
      availableLanguages,
    ).total;

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
        compatibilityScore,
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
            compatibilityScore,
          });
          break;
        case PairingMode.SEMI_AUTOMATIC:
        case PairingMode.AUTOMATIC:
          tandem = Tandem.create({
            id: this.uuidProvider.generate(),
            learningLanguages,
            status: TandemStatus.ACTIVE,
            universityValidations: [adminUniversityId],
            compatibilityScore,
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
      await this.sendTamdemBecomeActiveEmails(tandem);
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

  private async sendTamdemBecomeActiveEmails(tandem: Tandem): Promise<void> {
    const [learningLanguage1, learningLanguage2] = tandem.learningLanguages;

    const user1 = learningLanguage1.profile.user;
    const user2 = learningLanguage2.profile.user;

    if (user1.acceptsEmail) {
      try {
        await this.emailGateway.sendNewPartnerEmail({
          to: user1.email,
          language: learningLanguage1.profile.nativeLanguage.code,
          user: {
            firstname: user1.firstname,
            lastname: user1.lastname,
            university: user1.university.name,
          },
          partner: {
            firstname: user2.firstname,
            lastname: user2.lastname,
            university: user2.university.name,
          },
        });
      } catch (error) {
        this.logger.error(
          `Error sending email to user ${user1.email} after tandem creation: ${error}`,
        );
      }
    }

    if (user2.acceptsEmail) {
      try {
        await this.emailGateway.sendNewPartnerEmail({
          to: user2.email,
          language: learningLanguage2.profile.nativeLanguage.code,
          user: {
            firstname: user2.firstname,
            lastname: user2.lastname,
            university: user2.university.name,
          },
          partner: {
            firstname: user1.firstname,
            lastname: user1.lastname,
            university: user1.university.name,
          },
        });
      } catch (error) {
        this.logger.error(
          `Error sending email to user ${user2.email} after tandem creation: ${error}`,
        );
      }
    }

    const university1 = user1.university;
    const university2 = user2.university;
    const isSameUniversity = university1.id === university2.id;

    if (university1.notificationEmail) {
      try {
        await this.emailGateway.sendTandemValidationNoticeEmail({
          to: university1.notificationEmail,
          language: university1.country.code.toLowerCase(),
        });
      } catch (error) {
        this.logger.error(
          `Error sending email to university ${university1.notificationEmail} after tandem creation: ${error}`,
        );
      }
    }

    if (!isSameUniversity && university2.notificationEmail) {
      try {
        await this.emailGateway.sendTandemValidationNoticeEmail({
          to: university2.notificationEmail,
          language: university2.country.code.toLowerCase(),
        });
      } catch (error) {
        this.logger.error(
          `Error sending email to university ${university2.notificationEmail} after tandem creation: ${error}`,
        );
      }
    }
  }
}
