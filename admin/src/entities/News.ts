export interface NewsFormPayload {
    id?: string;
    universityId: string;
    title: string;
    content: string;
    languageCode: string;
    image: File | undefined;
    status: NewsStatus;
    translations: {
        title: string;
        content: string;
        languageCode: string;
    }[];
}

export enum NewsStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
}
