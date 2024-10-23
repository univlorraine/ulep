import { Language } from './language.model';
import { MediaObject } from './media.model';
import { Profile } from './profile.model';
import { University } from './university.model';

export enum EventStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
}

export enum EventType {
  ONLINE = 'ONLINE',
  PRESENTIAL = 'PRESENTIAL',
}

export interface EventTranslation {
  languageCode: string;
  content: string;
  title: string;
}

export interface EventObjectProps {
  id: string;
  title: string;
  content: string;
  languageCode: string;
  translations: EventTranslation[];
  authorUniversity: University;
  imageURL?: string;
  imageCredit?: string;
  image?: MediaObject;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  type: EventType;
  eventURL?: string;
  address?: string;
  addressName?: string;
  deepLink?: string;
  withSubscription: boolean;
  diffusionLanguages?: Language[];
  concernedUniversities?: University[];
  subscribedProfiles?: Profile[];
  createdAt: Date;
  updatedAt: Date;
}

export class EventObject {
  id: string;
  title: string;
  content: string;
  languageCode: string;
  translations: EventTranslation[];
  authorUniversity: University;
  imageURL?: string;
  imageCredit?: string;
  image?: MediaObject;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  type: EventType;
  eventURL?: string;
  address?: string;
  addressName?: string;
  deepLink?: string;
  withSubscription: boolean;
  diffusionLanguages?: Language[];
  concernedUniversities?: University[];
  subscribedProfiles?: Profile[];
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    title,
    content,
    languageCode,
    translations,
    authorUniversity,
    imageURL,
    imageCredit,
    image,
    status,
    startDate,
    endDate,
    type,
    eventURL,
    address,
    addressName,
    deepLink,
    withSubscription,
    diffusionLanguages,
    concernedUniversities,
    subscribedProfiles,
    createdAt,
    updatedAt,
  }: EventObjectProps) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.languageCode = languageCode;
    this.translations = translations;
    this.authorUniversity = authorUniversity;
    this.imageURL = imageURL;
    this.imageCredit = imageCredit;
    this.image = image;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.type = type;
    this.eventURL = eventURL;
    this.address = address;
    this.addressName = addressName;
    this.deepLink = deepLink;
    this.withSubscription = withSubscription;
    this.diffusionLanguages = diffusionLanguages;
    this.concernedUniversities = concernedUniversities;
    this.subscribedProfiles = subscribedProfiles;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
