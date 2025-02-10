import MediaObject from './MediaObject';
import University from './University';

export enum EditoMandatoryTranslation {
    CentralUniversityLanguage = 'CentralUniversityLanguage',
    English = 'English',
    PartnerUniversityLanguage = 'PartnerUniversityLanguage',
}

export interface EditoTranslation {
    languageCode: string;
    content: string;
}

export type Edito = {
    id: string;
    content: string;
    languageCode: string;
    translations: EditoTranslation[];
    university: University;
    imageURL?: string;
    image?: MediaObject;
    createdAt: Date;
    updatedAt: Date;
};

export interface EditoFormPayload {
    id: string;
    content: string;
    languageCode: string;
    image: File | undefined;
    translations: {
        content: string;
        languageCode: string;
    }[];
}
