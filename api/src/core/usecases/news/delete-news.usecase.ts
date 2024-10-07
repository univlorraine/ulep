import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

export class DeleteNewsCommand {
  id: string;
}

@Injectable()
export class DeleteNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(command: DeleteNewsCommand) {
    const news = await this.newsRepository.ofId(command.id);

    if (!news) {
      throw new RessourceDoesNotExist();
    }

    return this.newsRepository.delete(command.id);
  }
}
