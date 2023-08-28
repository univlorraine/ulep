import { Inject, Injectable } from '@nestjs/common';
import { Match, Tandem, TandemStatus } from 'src/core/models';
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

  // TODO: add score in Tandem ???

  async execute(command: GenerateTandemsCommand): Promise<Tandem[]> {
    const profiles =
      await this.profilesRepository.getProfilesUsableForTandemsGeneration({
        maxTandemPerProfile: 1, // TODO: change when multi-language
        universityIds: command.universityIds,
      });

    // Generate all possible pairs with score
    const possiblePairs: Match[] = [];
    for (let i = 0; i < profiles.length; i++) {
      const profileToPair = profiles[i];

      for (let j = i + 1; j < profiles.length; j++) {
        const potentialPairProfile = profiles[j];

        // TODO: check forbidden case (ex: already refused, other)
        const match = this.scorer.computeMatchScore(
          profileToPair,
          potentialPairProfile,
        );

        if (match.total > TRESHOLD_VIABLE_PAIR) {
          possiblePairs.push(match);
        }
      }
    }

    // TODO: sort by query time + priorities
    const sortedProfiles = profiles;

    let sortedPossiblePairs = possiblePairs.sort((a, b) => b.total - a.total);
    const pairedProfilesId = new Set();

    // Select best pairs by priority order
    const tandems: Tandem[] = [];
    for (const profileToPair of sortedProfiles) {
      if (pairedProfilesId.has(profileToPair.id)) {
        // Pair already found for this profile
        continue;
      }

      const pair = sortedPossiblePairs.find(
        (pair) =>
          pair.owner.id === profileToPair.id ||
          pair.target.id === profileToPair.id,
      );
      if (!pair) {
        // No viable pair found for profile
        continue;
      }

      const tandem = new Tandem({
        id: this.uuidProvider.generate(),
        profiles: [pair.owner, pair.target],
        status: TandemStatus.DRAFT,
      });

      tandems.push(tandem);
      // TODO: check if saveMany better
      await this.tandemsRepository.save(tandem);

      sortedPossiblePairs = sortedPossiblePairs.filter(
        (possiblePair) =>
          possiblePair.owner.id !== pair.owner.id &&
          possiblePair.owner.id !== pair.target.id &&
          possiblePair.target.id !== pair.owner.id &&
          possiblePair.target.id !== pair.target.id,
      );

      pairedProfilesId.add(pair.owner.id);
      pairedProfilesId.add(pair.target.id);
    }

    return tandems;
  }
}
