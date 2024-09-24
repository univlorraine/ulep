import { Collection } from '@app/common';
import { News } from '../models/news.model';
import { CreateNewsCommand } from '../usecases/news/create-news.usecase';
import { UpdateNewsCommand } from '../usecases/news/update-news.usecase';
import { GetNewsRepositoryCommand } from 'src/providers/persistance/repositories/prisma-news-repository';

export const NEWS_REPOSITORY = 'news.repository';

export interface NewsRepository {
  findAll(query: GetNewsRepositoryCommand): Promise<Collection<News>>;
  ofId(id: string): Promise<News | null>;
  create(command: CreateNewsCommand): Promise<News>;
  update(command: UpdateNewsCommand): Promise<News>;
  delete(id: string): Promise<void>;
}
