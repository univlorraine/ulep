/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
