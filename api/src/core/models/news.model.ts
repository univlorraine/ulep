import { MediaObject } from './media.model';
import { TextContent } from './translation.model';

export interface NewsTranslation {
  languageCode: string;
  content: string;
  title: string;
}

export interface NewsProps {
  id: string;
  title: TextContent;
  content: TextContent;
  universityId: string;
  image?: MediaObject;
  createdAt: Date;
  updatedAt: Date;
}

export class News {
  readonly id: string;
  readonly title: TextContent;
  readonly content: TextContent;
  readonly image?: MediaObject;
  readonly universityId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    id,
    title,
    content,
    image,
    universityId,
    createdAt,
    updatedAt,
  }: NewsProps) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
    this.universityId = universityId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

interface NewsWithTranslationsProps extends NewsProps {
  translations?: string;
}

export class NewsWithTranslations extends News {
  readonly translations?: string;

  constructor(props: NewsWithTranslationsProps) {
    super(props);
    this.translations = props.translations;
  }
}
