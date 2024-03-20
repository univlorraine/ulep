import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Match,
  PairingMode,
  Role,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import {
  EMAIL_GATEWAY,
  EmailGateway,
  NewPartnerEmail,
  NewTandemNoticeEmailProps,
} from 'src/core/ports/email.gateway';
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
} from 'src/core/ports/tandem.repository';
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

              if (
                match.total > TRESHOLD_VIABLE_PAIR &&
                match.isAValidTandem()
              ) {
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

    const notificationEmails: {
      type: 'sendNewPartnerEmail' | 'sendNewTandemNoticeEmail';
      payload: NewPartnerEmail | NewTandemNoticeEmailProps;
    }[] = [];

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

        if (tandemStatus !== TandemStatus.ACTIVE) {
          continue;
        }

        const owner = pair.owner.profile.user;
        const target = pair.target.profile.user;

        if (owner.acceptsEmail) {
          notificationEmails.push({
            type: 'sendNewPartnerEmail',
            payload: {
              to: owner.email,
              language: pair.owner.profile.nativeLanguage.code,
              user: { ...owner, university: owner.university.name },
              partner: { ...target, university: target.university.name },
            },
          });
        }

        if (target.acceptsEmail) {
          notificationEmails.push({
            type: 'sendNewPartnerEmail',
            payload: {
              to: target.email,
              language: pair.target.profile.nativeLanguage.code,
              user: { ...target, university: target.university.name },
              partner: { ...owner, university: owner.university.name },
            },
          });
        }

        if (owner.university.notificationEmail) {
          notificationEmails.push({
            type: 'sendNewTandemNoticeEmail',
            payload: {
              to: owner.university.notificationEmail,
              language: owner.university.country.code.toLowerCase(),
              user: { ...owner, university: owner.university.name },
              partner: { ...target, university: target.university.name },
            },
          });
        }

        if (
          owner.university.id !== target.university.id &&
          target.university.notificationEmail
        ) {
          notificationEmails.push({
            type: 'sendNewTandemNoticeEmail',
            payload: {
              to: target.university.notificationEmail,
              language: target.university.country.code.toLowerCase(),
              user: { ...target, university: target.university.name },
              partner: { ...owner, university: owner.university.name },
            },
          });
        }
      }
    }

    await this.tandemsRepository.saveMany(tandems);

    for (const notificationEmail of notificationEmails) {
      const method = notificationEmail.type;
      const payload = notificationEmail.payload;

      try {
        await this.emailGateway[method](payload);
      } catch (error) {
        this.logger.error(`Error on ${method} with ${JSON.stringify(payload)}`);
      }
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
