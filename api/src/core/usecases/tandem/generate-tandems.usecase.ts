import { Inject, Injectable } from '@nestjs/common';
import { Profile } from 'src/core/models';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import { IMatchScorer, MatchScorer } from 'src/core/services/MatchScorer';
import { ProfilesPairer } from 'src/core/services/ProfilesPairer';

@Injectable()
export class GenerateTandemsUsecase {
  private readonly scorer: IMatchScorer = new MatchScorer();

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
  ) {}

  async execute(): Promise<{ profiles: Profile[]; score: number }[]> {
    const profiles = await this.profilesRepository.availableOnly();
    const groups = await this.findGroups(profiles);
    const tandems = this.createTandems(groups.groupA, groups.groupB);

    return tandems;
  }

  // TODO: this should be in a ProfilesPairer service
  // TODO: order profiles by priority (central, roles, goals)
  private async findGroups(profiles: Profile[]) {
    const midIndex: number = Math.ceil(profiles.length / 2);

    const groupA = profiles.slice(0, midIndex);
    const groupB = profiles.slice(midIndex);

    return { groupA, groupB };
  }

  private createTandems(groupA: Profile[], groupB: Profile[]) {
    const pairs = new ProfilesPairer(
      groupA,
      groupB,
      this.scorer,
    ).findStablePairs();

    return pairs.map((pair) => ({
      profiles: [pair.proposer, pair.acceptor],
      score: pair.score,
    }));
  }
}
