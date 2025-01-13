import { Inject, Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Profile } from 'src/core/models';
import {
  LogEntry,
  LogEntryAddVocabulary,
  LogEntryCustomEntry,
  LogEntryEditActivity,
  LogEntryPlayedGame,
  LogEntryShareVocabulary,
  LogEntrySubmitActivity,
  LogEntryTandemChat,
  LogEntryVisio,
} from 'src/core/models/log-entry.model';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import { PassThrough } from 'stream';

export type ExportLogEntriesCommand = {
  learningLanguageId: string;
  userId: string;
};

@Injectable()
export class ExportLogEntriesUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(command: ExportLogEntriesCommand) {
    const profile = await this.assertUserExists(command.userId);
    const learningLanguage = await this.assertLearningLanguageExists(
      command.learningLanguageId,
    );
    const isExportForCurrentUser = this.isExportForCurrentUser(
      command.learningLanguageId,
      profile,
    );

    if (!learningLanguage.sharedLogsDate && !isExportForCurrentUser) {
      throw new RessourceDoesNotExist(
        'Learning language does not have shared logs',
      );
    }

    const logEntries = await this.logEntryRepository.findAllForLearningLanguage(
      command.learningLanguageId,
      isExportForCurrentUser ? new Date() : learningLanguage.sharedLogsDate,
    );

    const buffer = await this.exportToCSV(logEntries);

    return { buffer, language: learningLanguage.language };
  }

  private async exportToCSV(logEntries: LogEntry[]): Promise<Buffer> {
    const passThrough = new PassThrough();
    const csvStringifier = stringify({
      header: true,
      columns: ['id', 'type', 'date', 'metadata'],
    });

    csvStringifier.pipe(passThrough);

    logEntries.forEach((entry) => {
      csvStringifier.write({
        id: entry.id,
        type: entry.type,
        date: entry.createdAt.toISOString(),
        metadata: this.formatMetadata(entry),
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

  private formatMetadata(entry: LogEntry): string {
    if (entry instanceof LogEntryVisio) {
      return JSON.stringify({
        duration: entry.duration,
        partner: `${entry.tandemFirstname} ${entry.tandemLastname}`,
      });
    } else if (entry instanceof LogEntryTandemChat) {
      return JSON.stringify({
        partner: `${entry.tandemFirstname} ${entry.tandemLastname}`,
      });
    } else if (entry instanceof LogEntryCustomEntry) {
      return JSON.stringify({
        title: entry.title,
        content: entry.content,
      });
    } else if (
      entry instanceof LogEntryShareVocabulary ||
      entry instanceof LogEntryAddVocabulary
    ) {
      return JSON.stringify({
        listName: entry.vocabularyListName,
      });
    } else if (
      entry instanceof LogEntryEditActivity ||
      entry instanceof LogEntrySubmitActivity
    ) {
      return JSON.stringify({
        title: entry.activityTitle,
      });
    } else if (entry instanceof LogEntryPlayedGame) {
      return JSON.stringify({
        gameName: entry.gameName,
        percentage: entry.percentage,
      });
    }
    return '';
  }

  private async assertLearningLanguageExists(learningLanguageId: string) {
    const learningLanguage =
      await this.learningLanguageRepository.ofId(learningLanguageId);

    if (!learningLanguage) {
      throw new RessourceDoesNotExist('Learning language does not exist');
    }

    return learningLanguage;
  }

  private async assertUserExists(userId: string) {
    const profile = await this.profileRepository.ofUser(userId);

    return profile;
  }

  private isExportForCurrentUser(
    learningLanguageId: string,
    profile?: Profile,
  ) {
    return profile?.learningLanguages.some(
      (learningLanguage) => learningLanguage.id === learningLanguageId,
    );
  }
}
