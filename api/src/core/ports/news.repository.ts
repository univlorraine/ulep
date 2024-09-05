import { Collection } from '@app/common';
import { News } from '../models/news.model';
import { CreateNewsCommand } from '../usecases/news/create-news.usecase';
import { UpdateNewsCommand } from '../usecases/news/update-news.usecase';

export const NEWS_REPOSITORY = 'news.repository';

export interface NewsRepository {
  findAll(): Promise<Collection<News>>;
  ofId(id: string): Promise<News | null>;
  create(command: CreateNewsCommand): Promise<News>;
  update(command: UpdateNewsCommand): Promise<News>;
  delete(id: string): Promise<void>;
}
