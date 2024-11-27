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

export type GetAllEntriesForUserByDateCommand = {
  id: string;
  learningLanguageId: string;
  date: Date;
  page: number;
  limit: number;
};

@Injectable()
export class GetAllEntriesForUserByDateUsecase {
  constructor(
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(command: GetAllEntriesForUserByDateCommand) {
    await this.assertLearningLanguageExists(command.learningLanguageId);

    return this.logEntryRepository.findAllForUserIdByDate(
      command.learningLanguageId,
      command.date,
      command.page,
      command.limit,
    );
  }

  private async assertLearningLanguageExists(learningLanguageId: string) {
    const learningLanguage =
      await this.learningLanguageRepository.ofId(learningLanguageId);
    if (!learningLanguage) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }
}
