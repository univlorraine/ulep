/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
  LogEntryPublishActivity,
  LogEntryShareVocabulary,
  LogEntrySubmitActivity,
  LogEntryType,
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
      columns: ['Date', 'Activity', 'Titre', 'Quantité', 'Détail'],
    });

    csvStringifier.pipe(passThrough);

    // Ignore chat entry : https://dev.azure.com/theTribe-Mobile/UL%20E-Tandem/_sprints/backlog/UL%20E-Tandem%20Team/UL%20E-Tandem/T2%20Sprint%2025?System.State=In%20Progress%2CNew&System.AssignedTo=_Unassigned_%2Cmarvyn.orourke%40thetribe.io&workitem=4542
    logEntries
      .filter(
        (entry) =>
          entry instanceof LogEntry &&
          entry.type !== LogEntryType.COMMUNITY_CHAT &&
          entry.type !== LogEntryType.TANDEM_CHAT,
      )
      .forEach((entry) => {
        csvStringifier.write({
          Date: entry.createdAt.toISOString(),
          Activity: entry.type,
          Titre: this.getActivityTitle(entry),
          Quantité: this.getQuantity(entry),
          Détail: this.getDetail(entry),
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

  private getActivityTitle(entry: LogEntry): string {
    if (
      entry instanceof LogEntrySubmitActivity ||
      entry instanceof LogEntryPublishActivity ||
      entry instanceof LogEntryEditActivity
    ) {
      return entry.activityTitle;
    } else if (
      entry instanceof LogEntryAddVocabulary ||
      entry instanceof LogEntryShareVocabulary
    ) {
      return entry.vocabularyListName;
    } else if (entry instanceof LogEntryCustomEntry) {
      return entry.title;
    } else if (entry instanceof LogEntryPlayedGame) {
      return entry.gameName;
    }

    return '';
  }

  private getQuantity(entry: LogEntry): string {
    if (entry instanceof LogEntryVisio) {
      return entry.duration.toString();
    } else if (entry instanceof LogEntryAddVocabulary) {
      return entry.entryNumber.toString();
    }

    return '';
  }

  private getDetail(entry: LogEntry): string {
    if (
      entry instanceof LogEntrySubmitActivity ||
      entry instanceof LogEntryPublishActivity ||
      entry instanceof LogEntryEditActivity ||
      entry instanceof LogEntryAddVocabulary ||
      entry instanceof LogEntryShareVocabulary
    ) {
      return entry.learningLanguage.language.name;
    } else if (entry instanceof LogEntryPlayedGame) {
      return entry.percentage.toString();
    }

    return '';
  }
}
