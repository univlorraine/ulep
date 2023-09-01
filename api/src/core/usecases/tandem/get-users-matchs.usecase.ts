import { Collection } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LearningLanguageHasNoAssociatedProfile,
  ProfileIsNotInCentralUniversity,
} from 'src/core/errors/tandem-exceptions';
import { LearningLanguage, Match, Profile } from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import { MatchScorer } from 'src/core/services/MatchScorer';

export type GetUserMatchCommand = {
  id: string;
  count?: number;
};

const DEFAULT_NB_USER_MATCHES = 5;

@Injectable()
export class GetUserMatchUsecase {
  private readonly logger = new Logger(GetUserMatchUsecase.name);

  // TODO(NOW+2): see if should include organization as UC command

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    private readonly matchService: MatchScorer,
  ) {}

  async execute(command: GetUserMatchCommand): Promise<Collection<Match>> {
    const learningLanguage = await this.tryToFindTheLearningLanguageOfId(
      command.id,
    );

    const owner = learningLanguage.profile;
    if (!owner) {
      throw new LearningLanguageHasNoAssociatedProfile(command.id);
    }

    if (!owner.user.university.isCentralUniversity()) {
      throw new ProfileIsNotInCentralUniversity(command.id);
    }

    // TODO: in case of discovery, search for profiles learning the language too
    // TODO(NOW-0): manage joker language (just get learningLanguages not in Active tandem)
    const targets =
      await this.learningLanguageRepository.getLearningLanguagesOfProfileSpeakingAndNotInActiveTandem(
        learningLanguage.language.id,
      );

    this.logger.debug(
      `Found ${targets.length} potential learningLanguages match for learningLanguage ${command.id}`,
    );

    const potentialMatchs: Match[] = [];

    for (const target of targets) {
      if (target.profile.id === owner.id) continue;

      const match = this.matchService.computeMatchScore(
        learningLanguage,
        target,
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
