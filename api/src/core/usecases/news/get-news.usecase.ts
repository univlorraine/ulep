import { Inject, Injectable } from '@nestjs/common';
import { GetNewsQuery } from 'src/api/dtos/news';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

@Injectable()
export class GetNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(query: GetNewsQuery) {
    return this.newsRepository.findAll(query);
  }
}
