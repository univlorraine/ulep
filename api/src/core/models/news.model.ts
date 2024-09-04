import { MediaObject } from './media.model';
import { University } from './university.model';

export interface NewsTranslation {
  languageCode: string;
  content: string;
  title: string;
}

export interface NewsProps {
  id: string;
  title: string;
  content: string;
  university: University;
  image?: MediaObject;
  translations: NewsTranslation[];
  languageCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export class News {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly translations?: NewsTranslation[];
  readonly languageCode?: string;
  readonly image?: MediaObject;
  readonly university: University;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    id,
    title,
    content,
    image,
    translations,
    languageCode,
    university,
    createdAt,
    updatedAt,
  }: NewsProps) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
    this.translations = translations;
    this.languageCode = languageCode;
    this.university = university;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
