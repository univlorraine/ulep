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
  concernedUniversities: string[];
  diffusionLanguages: string[];
  startDate: Date;
  endDate: Date;
};

export type UpdateEventProps = {
  id: string;
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
    languageCodes?: string[];
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
