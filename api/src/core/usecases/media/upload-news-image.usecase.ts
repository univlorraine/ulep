import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';
import { MediaObject, News } from 'src/core/models';
import { UnauthorizedOperation } from 'src/core/errors';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

export class UploadNewsImageCommand {
  id: string;
  file: File;
}

@Injectable()
export class UploadNewsImageUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(command: UploadNewsImageCommand) {
    const news = await this.tryToFindNews(command.id);
    const previousImage = await this.tryToFindTheImageOfNews(news);
    if (news) {
      await this.deletePreviousNewsImage(previousImage);
    }

    const image = await this.upload(news, command.file);

    const url = this.storageInterface.temporaryUrl(
      image.bucket,
      image.name,
      60 * 60 * 24,
    );

    return url;
  }

  private async tryToFindNews(id: string): Promise<News> {
    const instance = await this.newsRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheImageOfNews(news: News): Promise<MediaObject | null> {
    return this.mediaObjectRepository.findOne(
      `${news.university.id}/${news.id}`,
    );
  }

  private async upload(
    news: News,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.image(
      file,
      'news',
      `${news.university.id}/${news.id}`,
    );

    await this.storageInterface.write(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveNewsImage(news, image);

    return image;
  }

  private async deletePreviousNewsImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
