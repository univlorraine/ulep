import { Inject, Injectable } from '@nestjs/common';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

@Injectable()
export class GetOneNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(id: string) {
    return this.newsRepository.ofId(id);
  }
}
