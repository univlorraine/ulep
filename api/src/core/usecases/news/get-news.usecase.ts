import { Inject, Injectable } from '@nestjs/common';
import { GetNewsQuery } from 'src/api/dtos/news';
import { NewsStatus } from 'src/core/models';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

export type GetNewsCommand = {
  page: number;
  limit: number;
  where: {
    title: string;
    universityId: string;
    status: NewsStatus;
    languageCode: string;
  };
};

@Injectable()
export class GetNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(query: GetNewsCommand) {
    const { page, limit, where } = query;
    const offset = (page - 1) * limit;
    return await this.newsRepository.findAll({
      offset,
      limit,
      where,
    });
  }
}
