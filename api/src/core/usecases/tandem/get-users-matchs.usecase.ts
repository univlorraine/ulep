import { Collection } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LearningLanguageHasNoAssociatedProfile,
  ProfileIsNotInCentralUniversity,
} from 'src/core/errors/tandem-exceptions';
import { LearningLanguage, Match } from 'src/core/models';
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

// TODO(NOW+1): rename UC in GetLearningLanguageMatchUsecase
@Injectable()
export class GetUserMatchUsecase {
  private readonly logger = new Logger(GetUserMatchUsecase.name);

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

    const languagesThatCanBeLearnt =
      await this.languageRepository.getLanguagesProposedToLearning();

    let targets = [];
    if (learningLanguage.language.isJokerLanguage()) {
      const languageIdsSpokenByOwner = [
        owner.nativeLanguage,
        ...owner.masteredLanguages,
      ].map((language) => language.id);

      const languageIdsSupportedByUniversity = languagesThatCanBeLearnt.map(
        (language) => language.id,
      );

      targets =
        await this.learningLanguageRepository.getAvailableLearningLanguagesSpeakingDifferentLanguageFromOwnerAndFromUniversities(
          owner.id,
          languageIdsSpokenByOwner,
          languageIdsSupportedByUniversity,
          command.universityIds,
        );
    } else {
      targets =
        await this.learningLanguageRepository.getAvailableLearningLanguagesSpeakingLanguageFromUniversities(
          learningLanguage.language.id,
          command.universityIds,
          learningLanguage.isDiscovery(),
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
        languagesThatCanBeLearnt,
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
