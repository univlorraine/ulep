import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage } from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';

interface GetLearningLanguageOfIdQuery {
  id: string;
}

@Injectable()
export class GetLearningLanguageOfIdUsecase {
  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(
    query: GetLearningLanguageOfIdQuery,
  ): Promise<LearningLanguage> {
    const learningLanguage = await this.learningLanguageRepository.ofId(
      query.id,
    );
    if (!learningLanguage) {
      throw new RessourceDoesNotExist();
    }

    return learningLanguage;
  }
}
