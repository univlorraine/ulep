import { Collection } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LearningLanguageHasNoAssociatedProfile,
  ProfileIsNotInCentralUniversity,
} from 'src/core/errors/tandem-exceptions';
import { LearningLanguage, LearningType, Match } from 'src/core/models';
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
import { MatchScorer } from 'src/core/services/MatchScorer';

export type GetUserMatchCommand = {
  id: string;
  count?: number;
  universityIds: string[];
};

const DEFAULT_NB_USER_MATCHES = 5;

@Injectable()
export class GetLearningLanguageMatchesUsecase {
  private readonly logger = new Logger(GetLearningLanguageMatchesUsecase.name);

  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    private readonly matchService: MatchScorer,
    @Inject(REFUSED_TANDEMS_REPOSITORY)
    private readonly refusedTandemsRepository: RefusedTandemsRepository,
  ) {}

  async execute(command: GetUserMatchCommand): Promise<Collection<Match>> {
    const learningLanguage = await this.tryToFindTheLearningLanguageOfId(
      command.id,
    );

    const owner = learningLanguage.profile;
    if (!owner) {
      throw new LearningLanguageHasNoAssociatedProfile(command.id);
    } else if (!owner.user.university.isCentralUniversity()) {
      throw new ProfileIsNotInCentralUniversity(command.id);
    }

    const languagesAvailableForLearning = (
      await this.languageRepository.getLanguagesProposedToLearning()
    ).filter((language) => !language.isJokerLanguage());

    let targets = [];
    if (learningLanguage.language.isJokerLanguage()) {
      // TODO(NOW): see if factorize
      const languageIdsSpokenByOwner = owner.spokenLanguages.map(
        (language) => language.id,
      );
      const languageIdsThatCanBeLearnt = languagesAvailableForLearning
        .map((language) => language.id)
        .filter((id) => !languageIdsSpokenByOwner.includes(id));

      targets =
        await this.learningLanguageRepository.getAvailableLearningLanguagesSpeakingDifferentLanguageAndFromUniversities(
          languageIdsThatCanBeLearnt,
          command.universityIds,
        );
    } else {
      targets =
        await this.learningLanguageRepository.getAvailableLearningLanguagesSpeakingLanguageFromUniversities(
          learningLanguage.language.id,
          command.universityIds,
          learningLanguage.isDiscovery() ||
            // We don't know if BOTH learning type can lead to discovery tandem yet
            // so we include it
            learningLanguage.learningType === LearningType.BOTH,
        );
    }

    const refusedTandems =
      await this.refusedTandemsRepository.getForLearningLanguage(
        learningLanguage.id,
      );
    const refusedPartnersMap = new Map<string, null>(
      refusedTandems.map((item) => {
        const partnerId = item.learningLanguageIds.find(
          (id) => id !== learningLanguage.id,
        );
        return [partnerId, null];
      }),
    );

    this.logger.verbose(
      `Found ${targets.length} potential learningLanguages match in universities ${command.universityIds} for learningLanguage ${command.id}`,
    );

    const potentialMatchs: Match[] = [];

    for (const target of targets) {
      if (target.profile.id === owner.id) continue;
      if (refusedPartnersMap.has(target.id)) continue;

      const match = this.matchService.computeMatchScore(
        learningLanguage,
        target,
        languagesAvailableForLearning,
      );

      potentialMatchs.push(match);
    }

    const matchs = potentialMatchs
      .filter((match) => match.total > 0)
      .sort((a, b) => b.total - a.total);

    return new Collection<Match>({
      items: matchs.slice(0, command.count || DEFAULT_NB_USER_MATCHES),
      totalItems: matchs.length,
    });
  }

  private async tryToFindTheLearningLanguageOfId(
    id: string,
  ): Promise<LearningLanguage> {
    const instance = await this.learningLanguageRepository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return instance;
  }
}
