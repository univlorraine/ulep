import { Inject, Injectable } from '@nestjs/common';
import { ProfileDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';
import { Match } from 'src/core/models/match';
import { Profile } from 'src/core/models/profile';
import { ProfileRepository } from 'src/core/ports/profile.repository';
import { MatchService } from 'src/core/services/matchs/MatchService';
import { PROFILE_REPOSITORY } from 'src/providers/providers.module';

export type GetMatchsByProfileIdCommand = {
  profileId: string;
  count?: number;
};

@Injectable()
export class GetMatchsByProfileIdUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    private readonly matchService: MatchService,
  ) {}

  async execute({
    profileId,
    count,
  }: GetMatchsByProfileIdCommand): Promise<Match[]> {
    const owner = await this.tryToFindTheProfileOf(profileId);

    const targets = await this.profileRepository.where({
      nativeLanguageCode: owner.learningLanguage.code,
      learningLanguageCode: owner.nativeLanguage.code,
    });

    const matchs: Match[] = [];

    for (const target of targets) {
      const score = this.matchService.computeMatchScore(owner, target);
      const match = new Match({ owner, target, score });
      matchs.push(match);
    }

    return matchs.sort((a, b) => b.score - a.score).slice(0, count);
  }

  private async tryToFindTheProfileOf(id: string): Promise<Profile> {
    const instance = await this.profileRepository.ofId(id);

    if (!instance) {
      throw ProfileDoesNotExist.forUser(id);
    }

    return instance;
  }
}
