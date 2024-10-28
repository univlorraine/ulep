import University from './University';

export enum NewsStatus {
    DRAFT = 'DRAFT',
    READY = 'READY',
}

export class NewsTranslation {
    constructor(
        public readonly languageCode: string,
        public readonly title: string,
        public readonly content: string
    ) {}
}

class News {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly content: string,
        public readonly translations: NewsTranslation[],
        public readonly languageCode: string,
        public readonly university: University,
        public readonly status: NewsStatus,
        public readonly startPublicationDate: Date,
        public readonly endPublicationDate: Date,
        public readonly imageUrl?: string,
        public readonly creditImage?: string
    ) {}
}

export default News;
