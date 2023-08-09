import { Inject, Injectable } from '@nestjs/common';
import { Profile, Tandem, TandemStatus } from 'src/core/models';
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
import { ProfilesPairer } from 'src/core/services/ProfilesPairer';

@Injectable()
export class GenerateTandemsUsecase {
  private readonly scorer: IMatchScorer = new MatchScorer();

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(): Promise<{ profiles: Profile[]; score: number }[]> {
    const profiles = await this.profilesRepository.whereMaxTandemsCount(3);

    const groups = await this.findGroups(profiles);

    // Do not re-recreate existing tandems
    const existingTandems = await this.tandemsRepository.getExistingTandems();

    const pairs = this.createTandemsPairs(
      groups.groupA,
      groups.groupB,
      existingTandems,
    );

    for (const pair of pairs) {
      // TODO: this should be an argument of the usecase
      if (pair.score < 0.5) {
        continue;
      }

      const tandem = new Tandem({
        id: this.uuidProvider.generate(),
        profiles: pair.profiles,
        status: TandemStatus.DRAFT,
      });

      await this.tandemsRepository.save(tandem);
    }

    return pairs;
  }

  // TODO: this should be in a ProfilesPairer service
  // TODO: order profiles by priority (central, roles, goals)
  private async findGroups(profiles: Profile[]) {
    const midIndex: number = Math.ceil(profiles.length / 2);

    const groupA = profiles.slice(0, midIndex);
    const groupB = profiles.slice(midIndex);

    return { groupA, groupB };
  }

  private createTandemsPairs(
    groupA: Profile[],
    groupB: Profile[],
    existingTandems: Tandem[],
  ) {
    const pairs = new ProfilesPairer(
      groupA,
      groupB,
      existingTandems,
      this.scorer,
    ).findStablePairs();

    return pairs.map((pair) => ({
      profiles: [pair.proposer, pair.acceptor],
      score: pair.score,
    }));
  }
}
