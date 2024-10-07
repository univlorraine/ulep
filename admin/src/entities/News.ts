import University from './University';

export interface NewsFormPayload {
    id?: string;
    universityId: string;
    title: string;
    content: string;
    languageCode: string;
    image: File | undefined;
    status: NewsStatus;
    startPublicationDate: Date;
    endPublicationDate: Date;
    translations: {
        title: string;
        content: string;
        languageCode: string;
    }[];
}

export type NewsTranslation = {
    languageCode: string;
    title: string;
    content: string;
};

export type News = {
    id: string;
    university: University;
    title: string;
    content: string;
    languageCode: string;
    image: File | undefined;
    status: NewsStatus;
    startPublicationDate: Date;
    endPublicationDate: Date;
    translations: NewsTranslation[];
};

export enum NewsStatus {
    DRAFT = 'DRAFT',
    READY = 'READY',
}
