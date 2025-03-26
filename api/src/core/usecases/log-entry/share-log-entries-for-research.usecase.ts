import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage } from 'src/core/models';
import { LogEntryType } from 'src/core/models/log-entry.model';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry/create-or-update-log-entry.usecase';

export type ShareLogForResearchEntriesCommand = {
  learningLanguageId: string;
};

@Injectable()
export class ShareLogForResearchEntriesUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
  ) {}

  async execute(command: ShareLogForResearchEntriesCommand) {
    const learningLanguage = await this.assertLearningLanguageExists(
      command.learningLanguageId,
    );
    console.log(learningLanguage);
    if (learningLanguage.sharedLogsDate == null) {
      throw 'Learning language is not shared';
    }
    await this.learningLanguageRepository.update({
      ...learningLanguage,
      sharedLogsForResearchDate: new Date(),
    } as LearningLanguage);

    await this.createShareLogEntry(command.learningLanguageId);
  }

  private async assertLearningLanguageExists(learningLanguageId: string) {
    const learningLanguage =
      await this.learningLanguageRepository.ofId(learningLanguageId);
    if (!learningLanguage) {
      throw new RessourceDoesNotExist('Learning language does not exist');
    }

    return learningLanguage;
  }

  private async createShareLogEntry(learningLanguageId: string) {
    await this.createOrUpdateLogEntryUsecase.execute({
      type: LogEntryType.SHARING_LOGS_FOR_RESEARCH,
      learningLanguageId: learningLanguageId,
      metadata: {},
    });
  }
}
