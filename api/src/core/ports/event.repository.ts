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

import { Collection } from '@app/common';
import {
  EventObject,
  EventStatus,
  EventTranslation,
  EventType,
} from '../models/event.model';

export const EVENT_REPOSITORY = 'event.repository';

export type CreateEventProps = {
  title: string;
  content: string;
  authorUniversityId: string;
  translations: EventTranslation[];
  languageCode: string;
  status?: string;
  type: EventType;
  imageCredit?: string;
  eventURL?: string;
  address?: string;
  addressName?: string;
  deepLink?: string;
  withSubscription: boolean;
  concernedUniversities?: string[];
  diffusionLanguages: string[];
  startDate: Date;
  endDate: Date;
};

export type UpdateEventProps = {
  id: string;
  title: string;
  content: string;
  translations: EventTranslation[];
  languageCode: string;
  status?: string;
  type: EventType;
  imageCredit?: string;
  eventURL?: string;
  address?: string;
  addressName?: string;
  deepLink?: string;
  withSubscription: boolean;
  concernedUniversities: string[];
  diffusionLanguages: string[];
  startDate: Date;
  endDate: Date;
};

export type FindEventsProps = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    title?: string;
    authorUniversityId?: string;
    concernedUniversitiesIds?: string[];
    status?: EventStatus;
    types?: EventType[];
    languageCode: string;
  };
  orderBy?: {
    field: string;
    order: string;
  };
};

export type FindEventsForAnUserProps = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    title?: string;
    universityId?: string;
    status?: EventStatus;
    types?: EventType[];
    allowedLanguages: string[][];
  };
};

export type SubscribeToEventProps = {
  eventId: string;
  profilesIds: string[];
};

export type UnsubscribeToEventProps = {
  eventId: string;
  profilesIds: string[];
};

export interface EventRepository {
  create(props: CreateEventProps): Promise<EventObject>;
  findAll(props: FindEventsProps): Promise<Collection<EventObject>>;
  findAllForAnUser(
    props: FindEventsForAnUserProps,
  ): Promise<Collection<EventObject>>;
  ofId(id: string): Promise<EventObject>;
  update(props: UpdateEventProps): Promise<EventObject>;
  subscribeToEvent(props: SubscribeToEventProps): Promise<EventObject>;
  unsubscribeToEvent(props: UnsubscribeToEventProps): Promise<EventObject>;
  delete(id: string): Promise<void>;
}
