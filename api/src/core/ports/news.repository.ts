import { Collection } from '@app/common';
import { News, NewsStatus } from '../models/news.model';
import { CreateNewsCommand } from '../usecases/news/create-news.usecase';
import { UpdateNewsCommand } from '../usecases/news/update-news.usecase';

export const NEWS_REPOSITORY = 'news.repository';

export interface NewsRepository {
  findAll(query: {
    offset?: number;
    limit?: number;
    onlyActiveNews?: boolean;
    where?: NewsQueryWhere;
    orderBy?: {
      field: string;
      order: string;
    };
  }): Promise<Collection<News>>;
  ofId(id: string): Promise<News | null>;
  create(command: CreateNewsCommand): Promise<News>;
  update(command: UpdateNewsCommand): Promise<News>;
  delete(id: string): Promise<void>;
}

export type NewsQueryWhere = {
  title: string;
  universityIds: string[];
  status: NewsStatus;
  languageCodes: string[];
};
