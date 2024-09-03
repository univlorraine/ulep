import { Collection } from '@app/common';
import { News } from '../models/news.model';

export const NEWS_REPOSITORY = 'news.repository';

export interface NewsRepository {
  findAll(): Promise<Collection<News>>;
  create(command: News): Promise<News>;
}
