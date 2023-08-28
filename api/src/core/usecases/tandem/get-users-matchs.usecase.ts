import { Collection } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { ProfileIsNotInCentralUniversity } from 'src/core/errors/tandem-exceptions';
import { Match, Profile } from 'src/core/models';
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

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly repository: ProfileRepository,
    private readonly matchService: MatchScorer,
  ) {}

  async execute(command: GetUserMatchCommand): Promise<Collection<Match>> {
    const owner = await this.tryToFindTheProfileOf(command.id);

    if (!owner.user.university.isCentralUniversity()) {
      throw new ProfileIsNotInCentralUniversity(command.id);
    }

    // TODO: in case of discovery, search for profiles learning the language too
    const targets = await this.repository.whereMaxTandemsCountAndSpokeLanguage({
      tandemsCount: 1,
      spokenLanguageId: owner.learningLanguages?.[0].language.id,
    });

    const potentialMatchs: Match[] = [];

    for (const target of targets) {
      if (target.id === owner.id) continue;

      const match = this.matchService.computeMatchScore(owner, target);
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

  private async tryToFindTheProfileOf(id: string): Promise<Profile> {
    const instance = await this.repository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return instance;
  }
}
