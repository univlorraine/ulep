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
import { differenceInMinutes } from 'date-fns';
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
  roomName: string;
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

    const otherLogEntries =
      (await this.logEntryRepository.findAllOfTypeTodayWithoutLearningLanguage(
        LogEntryType.VISIO,
      )) as LogEntryVisio[];

    const logEntry = logEntries[0] as LogEntryVisio;

    const otherParticipant = otherLogEntries.find((entry) => {
      if (entry.partnerTandemId && logEntry.partnerTandemId) {
        return (
          entry.roomName === command.roomName &&
          entry.partnerTandemId != logEntry.partnerTandemId
        );
      } else {
        return false;
      }
    });

    const otherEntryIsNow =
      otherParticipant?.updatedAt &&
      differenceInMinutes(new Date(), otherParticipant.updatedAt) < 2;

    if (logEntry && otherEntryIsNow) {
      await this.logEntryRepository.update({
        id: logEntry.id,
        metadata: {
          duration: logEntry.duration + 1,
          partnerTandemId: logEntry.partnerTandemId,
          tandemFirstname: logEntry.tandemFirstname,
          tandemLastname: logEntry.tandemLastname,
          roomName: logEntry.roomName,
        },
      });
    } else if (!logEntry) {
      await this.logEntryRepository.create({
        learningLanguageId: learningLanguage.id,
        type: LogEntryType.VISIO,
        metadata: {
          duration: 1,
          partnerTandemId: command.partnerTandemId,
          tandemFirstname: command.partnerFirstname,
          tandemLastname: command.partnerLastname,
          roomName: command.roomName,
        },
      });
    } else {
      await this.logEntryRepository.update({
        id: logEntry.id,
        metadata: {
          duration: logEntry.duration,
          partnerTandemId: logEntry.partnerTandemId,
          tandemFirstname: logEntry.tandemFirstname,
          tandemLastname: logEntry.tandemLastname,
          roomName: logEntry.roomName,
        },
      });
    }

    return newLearningLanguage;
  }
}
