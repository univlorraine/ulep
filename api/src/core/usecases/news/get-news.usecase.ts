import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { News, NewsStatus, Profile, Tandem } from 'src/core/models';
import {
  NewsRepository,
  NEWS_REPOSITORY,
} from 'src/core/ports/news.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';
import { GetTandemsForProfileUsecase } from 'src/core/usecases/tandem';

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
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(GetTandemsForProfileUsecase)
    private readonly getTandemsForProfileUsecase: GetTandemsForProfileUsecase,
  ) {}

  async execute(query: GetNewsCommand) {
    const { page, limit, where } = query;
    const offset = (page - 1) * limit;

    const profile = await this.profileRepository.ofUser(query.user.sub);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const tandems = await this.getTandemsForProfileUsecase.execute({
      profile: profile.id,
    });

    const universityIds = await this.getUniversityIdsFromProfile(
      profile,
      tandems,
    );

    let news = await this.newsRepository.findAll({
      offset,
      limit,
      onlyActiveNews: true,
      where: {
        ...where,
        status: NewsStatus.READY,
        universityIds,
      },
    });

    news = new Collection<News>({
      items: await this.fillNewsImageUrl(news.items),
      totalItems: news.totalItems,
    });

    return news;
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

  private async getUniversityIdsFromProfile(
    profile: Profile,
    tandems: Tandem[],
  ) {
    const universityIds: string[] = [];
    const centralUniversity =
      await this.universityRepository.findUniversityCentral();

    universityIds.push(centralUniversity.id);

    if (
      profile.user.university.id &&
      universityIds.indexOf(profile.user.university.id) === -1
    ) {
      universityIds.push(profile.user.university.id);
    }

    const universityIdsFromTandems: string[] = tandems
      .map((tandem) =>
        tandem.learningLanguages.map(
          (learningLanguage) => learningLanguage.profile.user.university.id,
        ),
      )
      .flat();
    for (const ids of universityIdsFromTandems) {
      if (ids && universityIds.indexOf(ids) === -1) {
        universityIds.push(ids);
      }
    }

    return universityIds;
  }
}
