import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage } from 'src/core/models';
import { LogEntryType, LogEntryVisio } from 'src/core/models/log-entry.model';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';

export class UpdateVisioDurationCommand {
  learningLanguageId: string;
  partnerTandemId: string;
  partnerFirstname: string;
  partnerLastname: string;
}

@Injectable()
export class UpdateVisioDurationUsecase {
  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
  ) {}

  async execute(
    command: UpdateVisioDurationCommand,
  ): Promise<LearningLanguage> {
    const learningLanguage = await this.learningLanguageRepository.ofId(
      command.learningLanguageId,
    );

    if (!learningLanguage) {
      throw new RessourceDoesNotExist();
    }

    const newLearningLanguage = new LearningLanguage({
      ...learningLanguage,
      visioDuration: learningLanguage.visioDuration + 1,
    });

    await this.learningLanguageRepository.update(newLearningLanguage);

    const logEntries = await this.logEntryRepository.findAllOfTypeToday(
      learningLanguage.id,
      LogEntryType.VISIO,
    );

    const logEntry = logEntries[0] as LogEntryVisio;

    if (logEntry) {
      await this.logEntryRepository.update({
        id: logEntry.id,
        metadata: {
          duration: logEntry.duration + 1,
          partnerTandemId: logEntry.partnerTandemId,
          tandemFirstname: logEntry.tandemFirstname,
          tandemLastname: logEntry.tandemLastname,
        },
      });
    } else {
      await this.logEntryRepository.create({
        learningLanguageId: learningLanguage.id,
        type: LogEntryType.VISIO,
        metadata: {
          duration: 1,
          partnerTandemId: command.partnerTandemId,
          tandemFirstname: command.partnerFirstname,
          tandemLastname: command.partnerLastname,
        },
      });
    }

    return newLearningLanguage;
  }
}
