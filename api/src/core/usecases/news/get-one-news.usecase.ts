import { Inject, Injectable } from '@nestjs/common';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';
import { GetMediaObjectUsecase } from '../media';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import { RessourceDoesNotExist } from 'src/core/errors';
import { News } from 'src/core/models';

@Injectable()
export class GetOneNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    private readonly getMediaObjectUsecase: GetMediaObjectUsecase,
  ) {}

  async execute(id: string): Promise<News> {
    const instance = await this.newsRepository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    const mediaObject = await this.getMediaObjectUsecase.execute({
      id: `${instance.university.id}/${instance.id}`,
    });
    const imageURL = mediaObject
      ? await this.storage.temporaryUrl(
          mediaObject.bucket,
          mediaObject.name,
          60 * 60 * 24,
        )
      : undefined;

    return { ...instance, imageURL };
  }
}
