import { Collection } from '@app/common';
import { News } from '../models/news.model';
import { CreateNewsCommand } from '../usecases/news/create-news.usecase';

export const NEWS_REPOSITORY = 'news.repository';

export interface NewsRepository {
  findAll(): Promise<Collection<News>>;
  create(command: CreateNewsCommand): Promise<News>;
}
