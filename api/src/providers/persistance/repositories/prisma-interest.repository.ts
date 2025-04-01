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

import { Collection, PrismaService, SortOrder } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Interest, InterestCategory } from 'src/core/models';
import { InterestRepository } from 'src/core/ports/interest.repository';
import {
  InterestCategoryRelations,
  InterestsRelations,
  interestCategoryMapper,
  interestMapper,
} from '../mappers';

@Injectable()
export class PrismaInterestRepository implements InterestRepository {
  private readonly logger = new Logger(PrismaInterestRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createInterest(
    interest: Interest,
    category: string,
  ): Promise<Interest> {
    await this.prisma.interests.create({
      data: {
        id: interest.id,
        Category: { connect: { id: category } },
        TextContent: {
          create: {
            id: interest.name.id,
            text: interest.name.content,
            LanguageCode: { connect: { code: interest.name.language } },
            Translations: {
              create: interest.name.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
      },
    });

    return interest;
  }

  async createCategory(category: InterestCategory): Promise<InterestCategory> {
    await this.prisma.interestCategories.create({
      data: {
        id: category.id,
        TextContent: {
          create: {
            id: category.name.id,
            text: category.name.content,
            LanguageCode: { connect: { code: category.name.language } },
            Translations: {
              create: category.name.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
      },
    });

    return category;
  }

  async interestOfId(id: string): Promise<Interest | null> {
    const interest = await this.prisma.interests.findUnique({
      where: { id },
      include: InterestsRelations,
    });

    if (!interest) {
      return null;
    }

    return interestMapper(interest);
  }

  async categoryOfId(id: string): Promise<InterestCategory | null> {
    const category = await this.prisma.interestCategories.findUnique({
      where: { id },
      include: InterestCategoryRelations,
    });

    if (!category) {
      return null;
    }

    return interestCategoryMapper(category);
  }

  async categoryOfName(name: string): Promise<InterestCategory | null> {
    const category = await this.prisma.interestCategories.findFirst({
      where: { TextContent: { text: name } },
      include: InterestCategoryRelations,
    });

    if (!category) {
      return null;
    }

    return interestCategoryMapper(category);
  }

  async interestByCategories(
    offset?: number,
    limit?: number,
    order?: SortOrder,
  ): Promise<Collection<InterestCategory>> {
    const count = await this.prisma.interestCategories.count();

    const categories = await this.prisma.interestCategories.findMany({
      skip: offset,
      orderBy: { TextContent: { text: order } },
      take: limit,
      include: InterestCategoryRelations,
    });

    return new Collection<InterestCategory>({
      items: categories.map(interestCategoryMapper),
      totalItems: count,
    });
  }

  async deleteInterest(instance: Interest): Promise<void> {
    // As we have a foreign key with cascade delete, we don't need to delete the interest.
    await this.prisma.textContent.delete({ where: { id: instance.name.id } });
  }

  async deleteCategory(instance: InterestCategory): Promise<void> {
    // As we have a foreign key with cascade delete, we don't need to delete the category.
    await this.prisma.textContent.delete({ where: { id: instance.name.id } });
  }

  async updateInterest(interest: Interest): Promise<Interest> {
    await this.prisma.textContent.update({
      where: {
        id: interest.name.id,
      },
      data: {
        text: interest.name.content,
        LanguageCode: { connect: { code: interest.name.language } },
        Translations: {
          deleteMany: {},
          create: interest.name.translations?.map((translation) => ({
            text: translation.content,
            LanguageCode: { connect: { code: translation.language } },
          })),
        },
      },
    });
    const newInterest = await this.prisma.interests.findUnique({
      where: {
        id: interest.id,
      },
      include: InterestsRelations,
    });

    return interestMapper(newInterest);
  }

  async updateInterestCategory(
    interestCategory: InterestCategory,
  ): Promise<InterestCategory> {
    await this.prisma.textContent.update({
      where: {
        id: interestCategory.name.id,
      },
      data: {
        text: interestCategory.name.content,
        LanguageCode: { connect: { code: interestCategory.name.language } },
        Translations: {
          deleteMany: {},
          create: interestCategory.name.translations?.map((translation) => ({
            text: translation.content,
            LanguageCode: { connect: { code: translation.language } },
          })),
        },
      },
    });
    const newInterestCategory = await this.prisma.interestCategories.findUnique(
      {
        where: {
          id: interestCategory.id,
        },
        include: InterestCategoryRelations,
      },
    );

    return interestCategoryMapper(newInterestCategory);
  }
}
