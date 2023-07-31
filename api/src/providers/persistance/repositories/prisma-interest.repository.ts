import { PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Interest, InterestCategory } from 'src/core/models';
import { InterestRepository } from 'src/core/ports/interest.repository';
import {
  IterestsRelations,
  TextContentRelations,
  textContentMapper,
} from '../mappers';

@Injectable()
export class PrismaInterestRepository implements InterestRepository {
  private readonly logger = new Logger(PrismaInterestRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createInterest(interest: Interest): Promise<Interest> {
    await this.prisma.interests.create({
      data: {
        id: interest.id,
        Category: { connect: { id: interest.category.id } },
        TextContent: {
          create: {
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

    return {
      id: interest.id,
      name: textContentMapper(interest.TextContent),
      category: {
        id: interest.Category.id,
        name: textContentMapper(interest.Category.TextContent),
      },
    };
  }

  async categoryOfId(id: string): Promise<InterestCategory | null> {
    const category = await this.prisma.interestCategories.findUnique({
      where: { id },
      include: {
        TextContent: TextContentRelations,
        Interests: { include: { TextContent: TextContentRelations } },
      },
    });

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      name: textContentMapper(category.TextContent),
      interests: category.Interests.map((interest) => ({
        id: interest.id,
        name: textContentMapper(interest.TextContent),
      })),
    };
  }

  async interestByCategories(): Promise<InterestCategory[]> {
    const categories = await this.prisma.interestCategories.findMany({
      include: {
        TextContent: TextContentRelations,
        Interests: { include: { TextContent: TextContentRelations } },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: textContentMapper(category.TextContent),
      interests: category.Interests.map((interest) => ({
        id: interest.id,
        name: textContentMapper(interest.TextContent),
      })),
    }));
  }

  async deleteInterest(instance: Interest): Promise<void> {
    // As we have a foreign key with cascade delete, we don't need to delete the interest.
    await this.prisma.textContent.delete({ where: { id: instance.name.id } });
  }

  async deleteCategory(instance: InterestCategory): Promise<void> {
    // As we have a foreign key with cascade delete, we don't need to delete the category.
    await this.prisma.textContent.delete({ where: { id: instance.name.id } });
  }
}
