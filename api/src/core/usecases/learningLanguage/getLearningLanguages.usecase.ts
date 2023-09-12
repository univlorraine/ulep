import { Collection, SortOrder } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { LearningLanguageWithTandem } from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageQuerySortKey,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';

interface GetLearningLanguagesQuery {
  universityIds: string[];
  hasActiveTandem?: boolean;
  page: number;
  limit: number;
  orderBy?: {
    field: LearningLanguageQuerySortKey;
    order: SortOrder;
  };
}

@Injectable()
export class GetLearningLanguagesUsecase {
  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(
    query: GetLearningLanguagesQuery,
  ): Promise<Collection<LearningLanguageWithTandem>> {
    return this.learningLanguageRepository.OfUniversities(query);
  }
}
