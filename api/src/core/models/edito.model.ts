import { MediaObject } from './media.model';
import { University } from './university.model';

export interface EditoTranslation {
  languageCode: string;
  content: string;
}

export class Edito {
  readonly id: string;
  readonly university: University;
  readonly content: string;
  readonly languageCode: string;
  readonly translations: EditoTranslation[];
  readonly image?: MediaObject;
  imageURL?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: Edito) {
    this.id = props.id;
    this.university = props.university;
    this.content = props.content;
    this.languageCode = props.languageCode;
    this.translations = props.translations;
    this.image = props.image;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
