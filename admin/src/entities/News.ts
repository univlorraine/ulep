export interface NewsFormPayload {
    id?: string;
    universityId: string;
    title: string;
    content: string;
    languageCode: string;
    image: File | undefined;
    published: boolean;
    translations: {
        title: string;
        content: string;
        languageCode: string;
    }[];
}
