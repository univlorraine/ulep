import { MediaObject } from './media.model';
import { University } from './university.model';

export enum NewsStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

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
  imageURL?: string;
  translations: NewsTranslation[];
  languageCode: string;
  createdAt: Date;
  updatedAt: Date;
  status: NewsStatus;
}

export class News {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly translations: NewsTranslation[];
  readonly languageCode: string;
  readonly image?: MediaObject;
  readonly imageURL?: string;
  readonly university: University;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: NewsStatus;

  constructor({
    id,
    title,
    content,
    image,
    imageURL,
    translations,
    languageCode,
    university,
    createdAt,
    updatedAt,
    status,
  }: NewsProps) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
    this.imageURL = imageURL;
    this.translations = translations;
    this.languageCode = languageCode;
    this.university = university;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
  }
}
