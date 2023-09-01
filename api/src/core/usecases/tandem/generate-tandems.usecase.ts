import { Inject, Injectable, Logger } from '@nestjs/common';
import { Match, Tandem, TandemStatus } from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
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

// TODO(NOW+2): test with more data (2k users ?)

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
  ) {}

  async execute(command: GenerateTandemsCommand): Promise<Tandem[]> {
    const learningLanguagesToPair =
      await this.learningLanguageRepository.getLearningLanguagesOfUniversitiesNotInActiveTandem(
        command.universityIds,
      );

    // TODO(NOW+2): check how to manage draft tandems (override them when re-generating ?)
    // URGENT

    this.logger.debug(
      `Found ${
        learningLanguagesToPair.length
      } potential learning languages for universities ${command.universityIds.join(
        ', ',
      )}`,
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
            const match = this.scorer.computeMatchScore(
              learningLanguageToPair,
              potentialPairLearningLanguage,
            );

            if (match.total > TRESHOLD_VIABLE_PAIR) {
              possiblePairs.push(match);
            }
          }
        }
      }
    }

    this.logger.debug(`Computed ${possiblePairs.length} potential pairs`);

    // TODO(NOW+2): global routine found 1 pair for each perticipant first ?
    const sortedLearningLanguages = learningLanguagesToPair
      .sort(
        (a, b) =>
          // TODO(NOW-0): when demand has been created rather than profile
          // sort by register time
          a.profile.createdAt?.getTime() - b.profile.createdAt?.getTime(),
      )
      .sort((a, b) => {
        // Sort by central university first
        if (
          a.profile.user.university.isCentralUniversity() ===
          b.profile.user.university.isCentralUniversity()
        ) {
          return 0;
        }
        return a.profile.user.university.isCentralUniversity() ? -1 : 1;
      });

    let sortedPossiblePairs = possiblePairs.sort((a, b) => b.total - a.total);
    const pairedLearningLanguageIds = new Set();

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

      const tandem = new Tandem({
        id: this.uuidProvider.generate(),
        learningLanguages: [pair.owner, pair.target],
        status: TandemStatus.DRAFT,
      });

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
    }

    await this.tandemsRepository.saveMany(tandems);

    this.logger.debug(`Generated ${tandems.length} tandems`);
    return tandems;
  }
}
