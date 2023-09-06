import { Collection } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { LearningLanguage } from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';

interface GetLearningLanguagesQuery {
  page: number;
  limit: number;
}

@Injectable()
export class GetLearningLanguagesUsecase {
  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(
    query: GetLearningLanguagesQuery,
  ): Promise<Collection<LearningLanguage>> {
    return this.learningLanguageRepository.get(query);
  }
}
