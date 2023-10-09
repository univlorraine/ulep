import { SendEmailPayload } from './../../ports/email.gateway';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Match,
  PairingMode,
  Role,
  Tandem,
  TandemStatus,
  University,
} from 'src/core/models';
import { EMAIL_TEMPLATE_IDS } from 'src/core/models/email-content.model';
import {
  EMAIL_TEMPLATE_REPOSITORY,
  EmailTemplateRepository,
} from 'src/core/ports/email-template.repository';
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
  REFUSED_TANDEMS_REPOSITORY,
  RefusedTandemsRepository,
} from 'src/core/ports/refused-tandems.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';
import { IMatchScorer, MatchScorer } from 'src/core/services/MatchScorer';

export type GenerateTandemsCommand = {
  universityIds: string[];
};

const TRESHOLD_VIABLE_PAIR = 0;

const getLearningLanguagesHash = (learningLanguageIds: string[]): string =>
  learningLanguageIds.sort((a, b) => a.localeCompare(b)).join('_');

// TODO(SOON): check if should add loop to generate / find pairs

@Injectable()
export class GenerateTandemsUsecase {
  private readonly scorer: IMatchScorer = new MatchScorer();
  private readonly logger = new Logger(GenerateTandemsUsecase.name);

  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(REFUSED_TANDEMS_REPOSITORY)
    private readonly refusedTandemsRepository: RefusedTandemsRepository,
    @Inject(EMAIL_TEMPLATE_REPOSITORY)
    private readonly emailTemplateRepository: EmailTemplateRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: GenerateTandemsCommand): Promise<Tandem[]> {
    const learningLanguagesToPair =
      await this.learningLanguageRepository.getAvailableLearningLanguagesOfUniversities(
        command.universityIds,
      );

    this.logger.verbose(
      `Found ${
        learningLanguagesToPair.length
      } potential learning languages for universities ${command.universityIds.join(
        ', ',
      )}`,
    );

    const languagesThatCanBeLearnt =
      await this.languageRepository.getLanguagesProposedToLearning();

    const refusedTandems = await this.refusedTandemsRepository.getAll();
    const refusedTandemsIdMap = new Map<string, null>(
      refusedTandems.map((refusedTandem) => [
        getLearningLanguagesHash(refusedTandem.learningLanguageIds),
        null,
      ]),
    );

    // Generate all possible pairs
    const possiblePairs: Match[] = [];
    for (let i = 0; i < learningLanguagesToPair.length; i++) {
      const learningLanguageToPair = learningLanguagesToPair[i];

      for (let j = i + 1; j < learningLanguagesToPair.length; j++) {
        const potentialPairLearningLanguage = learningLanguagesToPair[j];

        if (
          learningLanguageToPair.profile.id !==
          potentialPairLearningLanguage.profile.id
        ) {
          if (
            learningLanguageToPair.profile.user.university.isCentralUniversity() ||
            potentialPairLearningLanguage.profile.user.university.isCentralUniversity()
          ) {
            if (
              !refusedTandemsIdMap.has(
                getLearningLanguagesHash([
                  learningLanguageToPair.id,
                  potentialPairLearningLanguage.id,
                ]),
              )
            ) {
              const match = this.scorer.computeMatchScore(
                learningLanguageToPair,
                potentialPairLearningLanguage,
                languagesThatCanBeLearnt,
              );

              if (match.total > TRESHOLD_VIABLE_PAIR) {
                possiblePairs.push(match);
              }
            }
          }
        }
      }
    }

    this.logger.verbose(`Computed ${possiblePairs.length} potential pairs`);

    const sortedLearningLanguages = learningLanguagesToPair.sort((a, b) => {
      if (
        a.profile.user.university.isCentralUniversity() ===
        b.profile.user.university.isCentralUniversity()
      ) {
        if (a.profile.user.role === b.profile.user.role) {
          if (a.specificProgram === b.specificProgram) {
            return a.createdAt?.getTime() - b.createdAt?.getTime();
          } else if (!!a.specificProgram) {
            return -1;
          } else {
            return 1;
          }
        } else if (a.profile.user.role === Role.STAFF) {
          return -1;
        } else {
          return 1;
        }
      } else if (a.profile.user.university.isCentralUniversity()) {
        return -1;
      } else {
        return 1;
      }
    });

    const tandemsPendingValidation = await this.tandemsRepository.findWhere({
      status: TandemStatus.VALIDATED_BY_ONE_UNIVERSITY,
    });
    // Build map of pending tandem hash in order to efficiency determine if pending tandem
    // concerning 2 learning languages exist
    const tandemsPendingValidationMap = new Map<string, Tandem>(
      tandemsPendingValidation.items.map((tandem) => [
        tandem.getHash(),
        tandem,
      ]),
    );

    let sortedPossiblePairs = possiblePairs.sort((a, b) => b.total - a.total);
    const pairedLearningLanguageIds = new Set<string>();

    const universitiesWithNewTandems = new Map<string, University>([]);

    const notificationEmails: SendEmailPayload[] = [];

    // Select best pairs by priority order
    const tandems: Tandem[] = [];
    for (const learningLanguageToPair of sortedLearningLanguages) {
      if (pairedLearningLanguageIds.has(learningLanguageToPair.id)) {
        // Pair already found for this learning language
        continue;
      }

      const pair = sortedPossiblePairs.find(
        (pair) =>
          pair.owner.id === learningLanguageToPair.id ||
          pair.target.id === learningLanguageToPair.id,
      );
      if (!pair) {
        // No viable pair found for profile
        continue;
      }

      const tandemStatus =
        pair.owner.profile.user.university.pairingMode ===
          PairingMode.AUTOMATIC &&
        pair.target.profile.user.university.pairingMode ===
          PairingMode.AUTOMATIC
          ? TandemStatus.ACTIVE
          : TandemStatus.DRAFT;
      const tandem = new Tandem({
        id: this.uuidProvider.generate(),
        learningLanguages: [pair.owner, pair.target],
        status: tandemStatus,
        compatibilityScore: pair.total,
      });

      // Do not re-create a tandem that already exist and is pending validation
      if (!tandemsPendingValidationMap.has(tandem.getHash())) {
        tandems.push(tandem);

        sortedPossiblePairs = sortedPossiblePairs.filter(
          (possiblePair) =>
            possiblePair.owner.id !== pair.owner.id &&
            possiblePair.owner.id !== pair.target.id &&
            possiblePair.target.id !== pair.owner.id &&
            possiblePair.target.id !== pair.target.id,
        );

        pairedLearningLanguageIds.add(pair.owner.id);
        pairedLearningLanguageIds.add(pair.target.id);

        const ownerUniversity = pair.owner.profile.user.university;
        const targetUniversity = pair.target.profile.user.university;
        if (!universitiesWithNewTandems.has(ownerUniversity.id)) {
          universitiesWithNewTandems.set(ownerUniversity.id, ownerUniversity);
        }
        if (!universitiesWithNewTandems.has(targetUniversity.id)) {
          universitiesWithNewTandems.set(targetUniversity.id, targetUniversity);
        }

        if (tandemStatus === TandemStatus.ACTIVE) {
          if (pair.owner.profile.user.acceptsEmail) {
            const emailContentProfile1 =
              await this.emailTemplateRepository.getEmail(
                EMAIL_TEMPLATE_IDS.TANDEM_BECOME_ACTIVE,
                pair.owner.profile.nativeLanguage.code,
                {
                  firstname: pair.owner.profile.user.firstname,
                  partnerFirstname: pair.target.profile.user.firstname,
                  partnerLastname: pair.target.profile.user.lastname,
                  universityName: pair.owner.profile.user.university.name,
                },
              );
            notificationEmails.push({
              recipient: pair.owner.profile.user.email,
              email: emailContentProfile1,
            });
          }

          if (pair.target.profile.user.acceptsEmail) {
            const emailContentProfile2 =
              await this.emailTemplateRepository.getEmail(
                EMAIL_TEMPLATE_IDS.TANDEM_BECOME_ACTIVE,
                pair.target.profile.nativeLanguage.code,
                {
                  firstname: pair.target.profile.user.firstname,
                  partnerFirstname: pair.owner.profile.user.firstname,
                  partnerLastname: pair.owner.profile.user.lastname,
                  universityName: pair.target.profile.user.university.name,
                },
              );

            notificationEmails.push({
              recipient: pair.target.profile.user.email,
              email: emailContentProfile2,
            });
          }
        }
      }
    }

    await this.tandemsRepository.saveMany(tandems);

    if (universitiesWithNewTandems.size > 0) {
      for (const [universityId, university] of universitiesWithNewTandems) {
        if (university.notificationEmail) {
          const lng = university.country.code.toLowerCase();
          const emailContent = await this.emailTemplateRepository.getEmail(
            EMAIL_TEMPLATE_IDS.TANDEM_TO_REVIEW,
            lng,
          );
          notificationEmails.push({
            recipient: university.notificationEmail,
            email: emailContent,
          });
        } else {
          this.logger.warn(
            `University ${universityId} has no notification email configured`,
          );
        }
      }
    }

    if (notificationEmails.length > 0) {
      await this.emailGateway.bulkSend(notificationEmails);
    }

    const countDeletedTandems =
      await this.tandemsRepository.deleteTandemNotLinkedToLearningLangues();
    this.logger.verbose(
      `Removed ${countDeletedTandems} tandems for learning languages in tandems proposal`,
    );

    this.logger.verbose(`Generated ${tandems.length} tandems`);

    return tandems;
  }
}
