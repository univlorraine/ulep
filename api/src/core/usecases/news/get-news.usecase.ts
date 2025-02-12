import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { News } from 'src/core/models';
import {
  NewsRepository,
  NEWS_REPOSITORY,
} from 'src/core/ports/news.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';

export type GetNewsCommand = {
  user: KeycloakUser;
  page: number;
  limit: number;
  where: {
    title: string;
    languageCodes: string[];
  };
};

@Injectable()
export class GetNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetNewsCommand) {
    const { page, limit, where } = query;
    const offset = (page - 1) * limit;

    const user = await this.getUser(query.user.sub);

    let news = await this.newsRepository.findAllForAnUser({
      offset,
      limit,
      where: {
        ...where,
        universityId: user.university.id,
      },
    });

    news = new Collection<News>({
      items: await this.fillNewsImageUrl(news.items),
      totalItems: news.totalItems,
    });

    return news;
  }

  private async getUser(userId: string) {
    const user = await this.userRepository.ofId(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async fillNewsImageUrl(news: News[]) {
    const newsWithImageUrl: News[] = [];
    for (const currentNews of news) {
      if (currentNews.image) {
        const imageUrl = await this.storage.temporaryUrl(
          currentNews.image.bucket,
          currentNews.image.name,
          3600,
        );
        currentNews.imageURL = imageUrl;
      }
      newsWithImageUrl.push(currentNews);
    }
    return newsWithImageUrl;
  }
}
