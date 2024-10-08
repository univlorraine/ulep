import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';
import { MediaObject, News } from 'src/core/models';
import { UnauthorizedOperation } from 'src/core/errors';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

export class DeleteNewsImageCommand {
  id: string;
}

@Injectable()
export class DeleteNewsImageUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(command: DeleteNewsImageCommand) {
    const news = await this.tryToFindNews(command.id);
    await this.deleteNewsImage(news?.image);
  }

  private async tryToFindNews(id: string): Promise<News> {
    const instance = await this.newsRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private async deleteNewsImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
