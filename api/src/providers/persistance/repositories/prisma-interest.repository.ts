import { Collection, PrismaService, SortOrder } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Interest, InterestCategory } from 'src/core/models';
import { InterestRepository } from 'src/core/ports/interest.repository';
import {
  InterestCategoryRelations,
  IterestsRelations,
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
          },
        },
      },
    });

    return category;
  }

  async interestOfId(id: string): Promise<Interest | null> {
    const interest = await this.prisma.interests.findUnique({
      where: { id },
      include: IterestsRelations,
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
      include: IterestsRelations,
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
