import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';

export type GetAllEntriesForUserGroupedByDatesCommand = {
  learningLanguageId: string;
  page: number;
  limit: number;
};

@Injectable()
export class GetAllEntriesForUserGroupedByDatesUsecase {
  constructor(
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(command: GetAllEntriesForUserGroupedByDatesCommand) {
    await this.assertLearningLanguageExists(command.learningLanguageId);

    return this.logEntryRepository.findAllForLearningLanguageGroupedByDates(
      command.learningLanguageId,
      command.page,
      command.limit,
    );
  }

  private async assertLearningLanguageExists(learningLanguageId: string) {
    const learningLanguage =
      await this.learningLanguageRepository.ofId(learningLanguageId);
    if (!learningLanguage) {
      throw new RessourceDoesNotExist('Learning language does not exist');
    }
  }
}
