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

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LearningLanguage } from 'src/core/models';
import { EventStatus, EventType } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';

export type GetEventsCommand = {
  userId: string;
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    title?: string;
    types?: EventType[];
    languageCodes?: string[];
  };
};

@Injectable()
export class GetEventsUsecase {
  private readonly logger = new Logger(GetEventsUsecase.name);
  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storageAdapter: StorageInterface,
  ) {}

  async execute(command: GetEventsCommand) {
    const profile = await this.getProfileFromUser(command.userId);
    const allowedLanguages = await this.generateAllowedLanguages(
      profile.learningLanguages,
      command.filters.languageCodes,
    );

    const events = await this.eventRepository.findAllForAnUser({
      ...command,
      filters: {
        ...command.filters,
        status: EventStatus.READY,
        universityId: profile.user.university.id,
        allowedLanguages,
      },
    });

    for (const event of events.items) {
      if (event.image) {
        const imageUrl = await this.storageAdapter.temporaryUrl(
          event.image.bucket,
          event.image.name,
          3600,
        );
        event.imageURL = imageUrl;
      }
    }

    return { profile, events };
  }

  private async getProfileFromUser(userId: string) {
    const profile = await this.profileRepository.ofUser(userId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  private async generateAllowedLanguages(
    learningLanguages: LearningLanguage[],
    filteredLanguages: string[],
  ) {
    let allowedLanguages: string[][] = [];

    for (const learningLanguage of learningLanguages) {
      const tandem = await this.getTandemForLearningLanguage(learningLanguage);
      const firstLanguage = tandem
        ? tandem.learningLanguages[0].language.code
        : learningLanguage.language.code;
      const secondLanguage = tandem
        ? tandem.learningLanguages[1]?.language.code
        : undefined;

      const isFirstLanguageFiltered =
        !filteredLanguages ||
        filteredLanguages?.length === 0 ||
        filteredLanguages?.includes(firstLanguage);
      const isSecondLanguageFiltered =
        !filteredLanguages ||
        filteredLanguages?.length === 0 ||
        filteredLanguages?.includes(secondLanguage);

      if (
        isFirstLanguageFiltered &&
        !allowedLanguages.some((language) => language.includes(firstLanguage))
      ) {
        allowedLanguages.push([firstLanguage]);
      }

      if (
        secondLanguage &&
        isSecondLanguageFiltered &&
        !allowedLanguages.some((language) => language.includes(secondLanguage))
      ) {
        allowedLanguages.push([secondLanguage]);
      }

      if (
        (isFirstLanguageFiltered || isSecondLanguageFiltered) &&
        firstLanguage &&
        secondLanguage &&
        !allowedLanguages.some(
          (lang) =>
            (lang.length === 2 &&
              lang[0] === firstLanguage &&
              lang[1] === secondLanguage) ||
            (lang[0] === secondLanguage && lang[1] === firstLanguage),
        )
      ) {
        allowedLanguages.push([firstLanguage, secondLanguage]);
      }
    }

    return allowedLanguages;
  }

  private getTandemForLearningLanguage(learningLanguage: LearningLanguage) {
    return this.tandemRepository.getTandemForLearningLanguage(
      learningLanguage.id,
    );
  }
}
