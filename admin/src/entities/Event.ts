import Language from './Language';
import MediaObject from './MediaObject';
import University from './University';
import User from './User';

export interface EventFormPayload {
    id?: string;
    authorUniversityId: string;
    title: string;
    content: string;
    languageCode: string;
    image: File | undefined;
    imageCredit?: string;
    status: EventStatus;
    startDate: Date;
    endDate: Date;
    type: EventType;
    eventURL?: string;
    address?: string;
    addressName?: string;
    deepLink?: string;
    withSubscription: boolean;
    diffusionLanguages?: string[];
    concernedUniversities?: University[];
    translations: {
        title: string;
        content: string;
        languageCode: string;
    }[];
}

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

export type EventObject = {
    id: string;
    title: string;
    content: string;
    languageCode: string;
    translations: EventTranslation[];
    authorUniversity: University;
    imageURL?: string;
    image?: MediaObject;
    imageCredit?: string;
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
    enrolledUsers?: User[];
    createdAt: Date;
    updatedAt: Date;
};
