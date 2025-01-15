import MediaObject from './MediaObject';
import University from './University';

export interface EditoTranslation {
    languageCode: string;
    content: string;
}

export type Edito = {
    id: string;
    content: string;
    languageCode: string;
    translations: EditoTranslation[];
    authorUniversity: University;
    imageURL?: string;
    image?: MediaObject;
    createdAt: Date;
    updatedAt: Date;
};
