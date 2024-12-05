import { Inject, Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LogEntry } from 'src/core/models/log-entry.model';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';
import { PassThrough } from 'stream';

export type ExportLogEntriesCommand = {
  learningLanguageId: string;
};

@Injectable()
export class ExportLogEntriesUsecase {
  constructor(
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(command: ExportLogEntriesCommand) {
    const learningLanguage = await this.assertLearningLanguageExists(
      command.learningLanguageId,
    );

    if (!learningLanguage.sharedLogsDate) {
      throw new RessourceDoesNotExist(
        'Learning language does not have shared logs',
      );
    }

    const logEntries = await this.logEntryRepository.findAllForLearningLanguage(
      command.learningLanguageId,
      learningLanguage.sharedLogsDate,
    );

    const buffer = await this.exportToCSV(logEntries);

    return { buffer, language: learningLanguage.language };
  }

  private async exportToCSV(logEntries: LogEntry[]): Promise<Buffer> {
    const passThrough = new PassThrough();
    const csvStringifier = stringify({
      header: true,
      columns: ['id', 'type', 'date'],
    });

    csvStringifier.pipe(passThrough);

    logEntries.forEach((entry) => {
      csvStringifier.write({
        id: entry.id,
        type: entry.type,
        date: entry.createdAt.toISOString(),
      });
    });
    csvStringifier.end();

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      passThrough.on('data', (chunk) => chunks.push(chunk));
      passThrough.on('end', () => {
        const csvBuffer = Buffer.concat(chunks);
        resolve(csvBuffer);
      });
      passThrough.on('error', reject);
    });
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
