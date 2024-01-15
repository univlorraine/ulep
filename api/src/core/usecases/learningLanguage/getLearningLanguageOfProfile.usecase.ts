import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage } from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';

interface GetLearningLanguageOfProfileQuery {
  id: string;
}

@Injectable()
export class GetLearningLanguageOfProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly languageRepository: LearningLanguageRepository,
  ) {}

  async execute(
    query: GetLearningLanguageOfProfileQuery,
  ): Promise<LearningLanguage[]> {
    const profile = await this.profileRepository.ofId(query.id);
    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    return this.languageRepository.ofProfile(profile.id);
  }
}
