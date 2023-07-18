import { Inject, Injectable } from '@nestjs/common';
import { Profile } from 'src/core/models/profile';
import {
  LanguageCombination,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import { ProfileRepository } from 'src/core/ports/profile.repository';
import {
  IMatchScorer,
  MatchScorer,
} from 'src/core/services/matchs/MatchScorer';
import { ProfilesPairer } from 'src/core/services/matchs/ProfilesPairer';
import {
  LANGUAGE_REPOSITORY,
  PROFILE_REPOSITORY,
} from 'src/providers/providers.module';

@Injectable()
export class GenerateTandemsUsecase {
  private readonly scorer: IMatchScorer = new MatchScorer();

  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
  ) {}

  async execute(): Promise<{ profiles: Profile[]; score: number }[]> {
    const languages = await this.languageRepository.getUniqueCombinations();
    const tandems: { profiles: Profile[]; score: number }[] = [];

    for (const language of languages) {
      const { groupA, groupB } = await this.findGroups(language);
      const pairs = this.createTandems(groupA, groupB);
      tandems.push(...pairs);
    }

    return tandems;
  }

  private async findGroups(languages: LanguageCombination) {
    const learners = await this.profilesRepository.where({
      nativeLanguageCode: languages.nativeLanguage,
      learningLanguageCode: languages.learningLanguage,
    });

    const speakers = await this.profilesRepository.where({
      nativeLanguageCode: languages.learningLanguage,
      learningLanguageCode: languages.nativeLanguage,
    });

    if (learners.length > speakers.length) {
      return { groupA: speakers, groupB: learners };
    }

    return { groupA: learners, groupB: speakers };
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
