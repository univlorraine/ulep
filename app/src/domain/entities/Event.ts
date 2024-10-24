import Language from './Language';
import University from './University';

export enum EventStatus {
    DRAFT = 'DRAFT',
    READY = 'READY',
}

export enum EventType {
    ONLINE = 'ONLINE',
    PRESENTIAL = 'PRESENTIAL',
}

export class EventTranslation {
    constructor(
        public readonly languageCode: string,
        public readonly title: string,
        public readonly content: string
    ) {}
}

class EventObject {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly content: string,
        public readonly translations: EventTranslation[],
        public readonly authorUniversity: University,
        public readonly languageCode: string,
        public readonly status: EventStatus,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly type: EventType,
        public readonly withSubscription: boolean,
        public readonly diffusionLanguages: Language[],
        public readonly imageUrl?: string,
        public readonly creditImage?: string,
        public readonly eventURL?: string,
        public readonly address?: string,
        public readonly addressName?: string,
        public readonly deepLink?: string
    ) {}
}

export default EventObject;
