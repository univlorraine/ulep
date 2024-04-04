import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import { Collection } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguageHasNoAssociatedProfile } from 'src/core/errors/tandem-exceptions';
import { LearningLanguage, Match, MatchScores } from 'src/core/models';
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
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: GetUserMatchCommand): Promise<Collection<Match>> {
    const learningLanguage = await this.tryToFindTheLearningLanguageOfId(
      command.id,
    );

    const owner = learningLanguage.profile;
    if (!owner) {
      throw new LearningLanguageHasNoAssociatedProfile(command.id);
    }

    const targetUniveristies = owner.user.university.isCentralUniversity()
      ? command.universityIds
      : [(await this.universityRepository.findUniversityCentral()).id];

    const languagesAvailableForLearning = (
      await this.languageRepository.getLanguagesProposedToLearning()
    ).filter((language) => !language.isJokerLanguage());

    let targets: LearningLanguage[] = [];
    if (learningLanguage.language.isJokerLanguage()) {
      const languageIdsSpokenByOwner = owner.spokenLanguages.map(
        (language) => language.id,
      );
      const languageIdsThatCanBeLearnt = languagesAvailableForLearning
        .map((language) => language.id)
        .filter((id) => !languageIdsSpokenByOwner.includes(id));

      targets =
        await this.learningLanguageRepository.getAvailableLearningLanguagesSpeakingOneOfLanguagesAndFromUniversities(
          languageIdsThatCanBeLearnt,
          targetUniveristies,
        );
    } else {
      targets =
        await this.learningLanguageRepository.getAvailableLearningLanguagesSpeakingLanguageFromUniversities(
          learningLanguage.language.id,
          targetUniveristies,
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

      if (learningLanguage.isExclusive()) {
        if (learningLanguage.isExclusiveWithLearningLanguage(target)) {
          potentialMatchs.push(
            new Match({
              owner: learningLanguage,
              target: target,
              scores: MatchScores.exclusivity(),
            }),
          );
          break;
        }
      } else {
        const match = this.matchService.computeMatchScore(
          learningLanguage,
          target,
          languagesAvailableForLearning,
        );

        potentialMatchs.push(match);
      }
    }

    const matchs = potentialMatchs
      .filter((match) => match.total > 0 && match.isAValidTandem())
      .sort((a, b) => b.total - a.total);

    const items =
      command.count === 0
        ? matchs
        : matchs.slice(0, command.count || DEFAULT_NB_USER_MATCHES);

    return new Collection<Match>({
      items,
      totalItems: items.length,
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
