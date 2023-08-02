import { Collection } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
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

@Injectable()
export class GetUserMatchUsecase {
  private readonly logger = new Logger(GetUserMatchUsecase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    private readonly matchService: MatchScorer,
  ) {}

  async execute(command: GetUserMatchCommand): Promise<Collection<Match>> {
    const owner = await this.tryToFindTheProfileOf(command.id);

    const targets = await this.profileRepository.availableOnly({
      nativeLanguageCode: {
        not: owner.nativeLanguage.code,
      },
    });

    const matchs: Match[] = [];

    for (const target of targets) {
      if (target.id === owner.id) continue;

      const match = this.matchService.computeMatchScore(owner, target);
      matchs.push(match);
    }

    return new Collection<Match>({
      items: matchs.sort((a, b) => b.total - a.total).slice(0, command.count),
      totalItems: matchs.length,
    });
  }

  private async tryToFindTheProfileOf(id: string): Promise<Profile> {
    const instance = await this.profileRepository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return instance;
  }
}
