import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LogEntryCustomEntry } from 'src/core/models/log-entry.model';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';

export type UpdateCustomLogEntryCommand = {
  id: string;
  content: string;
  title: string;
  date: Date;
  learningLanguageId: string;
};

@Injectable()
export class UpdateCustomLogEntryUsecase {
  constructor(
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(command: UpdateCustomLogEntryCommand) {
    await this.assertLearningLanguageExists(command.learningLanguageId);
    await this.assertLogEntryExists(command.id);

    return this.logEntryRepository.update({
      id: command.id,
      createdAt: command.date,
      metadata: {
        content: command.content,
        title: command.title,
      },
    });
  }

  private async assertLearningLanguageExists(learningLanguageId: string) {
    const learningLanguage =
      await this.learningLanguageRepository.ofId(learningLanguageId);
    if (!learningLanguage) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }

  private async assertLogEntryExists(id: string) {
    const logEntry = await this.logEntryRepository.ofId(id);
    if (!logEntry) {
      throw new RessourceDoesNotExist('Log entry does not exist');
    }

    if (!(logEntry instanceof LogEntryCustomEntry)) {
      throw new UnauthorizedException('Only custom log entries can be updated');
    }
  }
}
