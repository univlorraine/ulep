import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage } from 'src/core/models';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';

export type UnshareLogForResearchEntriesCommand = {
  learningLanguageId: string;
};

@Injectable()
export class UnshareLogForResearchEntriesUsecase {
  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(command: UnshareLogForResearchEntriesCommand) {
    const learningLanguage = await this.assertLearningLanguageExists(
      command.learningLanguageId,
    );
    await this.learningLanguageRepository.update({
      ...learningLanguage,
      sharedLogsForResearchDate: undefined,
    } as LearningLanguage);
  }

  private async assertLearningLanguageExists(learningLanguageId: string) {
    const learningLanguage =
      await this.learningLanguageRepository.ofId(learningLanguageId);
    if (!learningLanguage) {
      throw new RessourceDoesNotExist('Learning language does not exist');
    }

    return learningLanguage;
  }
}
