import {
  EventObject,
  EventTranslation,
  EventType,
} from '../models/event.model';

export const EVENT_REPOSITORY = 'event.repository';

export type CreateEventProps = {
  title: string;
  content: string;
  universityId: string;
  translations: EventTranslation[];
  languageCode: string;
  status?: string;
  type: EventType;
  eventURL?: string;
  address?: string;
  addressName?: string;
  deepLink?: string;
  withSubscription: boolean;
  concernedUniversities: string[];
  diffusionLanguages: string[];
  enrolledUsers: string[];
  startDate: Date;
  endDate: Date;
};

export interface EventRepository {
  create(props: CreateEventProps): Promise<EventObject>;
  ofId(id: string): Promise<EventObject | null>;
}
