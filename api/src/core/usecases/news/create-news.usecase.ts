import { Inject, Injectable } from '@nestjs/common';
import { Translation } from 'src/core/models';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

export class CreateNewsCommand {
  title: string;
  content: string;
  languageCode: string;
  // translations?: Translation[];
}

@Injectable()
export class CreateNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(command: CreateNewsCommand) {
    return this.newsRepository.create(command);
  }
}
