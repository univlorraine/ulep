import { Inject, Injectable } from '@nestjs/common';
import { NewsStatus } from 'src/core/models';
import {
  NewsRepository,
  NEWS_REPOSITORY,
} from 'src/core/ports/news.repository';

export type GetNewsAdminCommand = {
  page: number;
  limit: number;
  where: {
    title: string;
    universityIds: string[];
    status: NewsStatus;
    languageCodes: string[];
  };
  orderBy?: {
    field: string;
    order: string;
  };
};

@Injectable()
export class GetNewsAdminUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(query: GetNewsAdminCommand) {
    const { page, limit, where, orderBy } = query;
    const offset = (page - 1) * limit;
    return await this.newsRepository.findAll({
      offset,
      limit,
      where,
      orderBy,
    });
  }
}
