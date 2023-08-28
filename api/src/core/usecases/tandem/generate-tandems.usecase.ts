import { Inject, Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(GenerateTandemsUsecase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: GenerateTandemsCommand): Promise<Tandem[]> {
    const profiles =
      await this.profilesRepository.getProfilesUsableForTandemsGeneration({
        maxTandemPerProfile: 1, // TODO: change when multi-language
        universityIds: command.universityIds,
      });
    // TODO: check how to manage draft tandems (override them when re-generating ?)

    this.logger.debug(
      `Found ${
        profiles.length
      } potential profiles for universities ${command.universityIds.join(
        ', ',
      )}`,
    );

    // Generate all possible pairs
    const possiblePairs: Match[] = [];
    for (let i = 0; i < profiles.length; i++) {
      const profileToPair = profiles[i];

      for (let j = i + 1; j < profiles.length; j++) {
        const potentialPairProfile = profiles[j];

        if (
          profileToPair.user.university.isCentralUniversity() ||
          potentialPairProfile.user.university.isCentralUniversity()
        ) {
          const match = this.scorer.computeMatchScore(
            profileToPair,
            potentialPairProfile,
          );

          if (match.total > TRESHOLD_VIABLE_PAIR) {
            possiblePairs.push(match);
          }
        }
      }
    }

    this.logger.debug(`Computed ${possiblePairs.length} potential pairs`);

    const sortedProfiles = profiles
      .sort(
        (a, b) =>
          // sort by register time
          a.createdAt?.getTime() - b.createdAt?.getTime(),
      )
      .sort((a, b) => {
        // Sort by central university first
        if (
          a.user.university.isCentralUniversity() ===
          b.user.university.isCentralUniversity()
        ) {
          return 0;
        }
        return a.user.university.isCentralUniversity() ? -1 : 1;
      });

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

    this.logger.debug(`Generated ${tandems.length} tandems`);
    return tandems;
  }
}
