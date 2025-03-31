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
import { RessourceDoesNotExist } from 'src/core/errors';
import { EventTranslation, EventType } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';

export type CreateEventCommand = {
  title: string;
  content: string;
  authorUniversityId: string;
  translations?: EventTranslation[];
  languageCode: string;
  status?: string;
  type: EventType;
  eventUrl?: string;
  imageCredit?: string;
  address?: string;
  addressName?: string;
  withSubscription: boolean;
  concernedUniversities?: string[];
  diffusionLanguages: string[];
  startDate: Date;
  endDate: Date;
};

@Injectable()
export class CreateEventUsecase {
  #googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query='; // TODO: move to config ?

  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateEventCommand) {
    await this.assertLanguageExists(command.languageCode);
    await this.assertUniversityExists(command.authorUniversityId);

    let addressUrl = undefined;
    if (command.address) {
      addressUrl = new URL(command.address, this.#googleMapsUrl).toString();
    }

    return this.eventRepository.create({
      title: command.title,
      content: command.content,
      languageCode: command.languageCode,
      translations: command.translations ?? [],
      authorUniversityId: command.authorUniversityId,
      status: command.status,
      startDate: command.startDate,
      endDate: command.endDate,
      type: command.type,
      eventURL: command.eventUrl,
      imageCredit: command.imageCredit,
      address: command.address,
      addressName: command.addressName,
      deepLink: addressUrl,
      withSubscription: command.withSubscription,
      concernedUniversities: command.concernedUniversities,
      diffusionLanguages: command.diffusionLanguages,
    });
  }

  private async assertUniversityExists(id: string) {
    const university = await this.universityRepository.ofId(id);

    if (!university) {
      throw new RessourceDoesNotExist('University does not exist');
    }

    return university;
  }

  private async assertLanguageExists(code: string) {
    const language = await this.languageRepository.ofCode(code.toLowerCase());

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }
}
