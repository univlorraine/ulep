import { Injectable } from '@nestjs/common';
import {
  LanguageCombination,
  LanguageRepository,
} from '../../../core/ports/language.repository';
import { PrismaService } from '../prisma.service';
import { Collection } from '../../../shared/types/collection';
import { Language } from '../../../core/models/language';
import { languageMapper } from '../mappers/language.mapper';

@Injectable()
export class PrismaLanguageRepository implements LanguageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofCode(code: string): Promise<Language | null> {
    const language = await this.prisma.language.findUnique({
      where: {
        code: code,
      },
    });

    if (!language) {
      return null;
    }

    return languageMapper(language);
  }

  async all(offset?: number, limit?: number): Promise<Collection<Language>> {
    const total = await this.prisma.language.count();
    const languages = await this.prisma.language.findMany({
      skip: offset,
      take: limit,
    });

    if (!languages) {
      return { items: [], totalItems: 0 };
    }

    return {
      items: languages.map(languageMapper),
      totalItems: total,
    };
  }

  async getUniqueCombinations(): Promise<LanguageCombination[]> {
    const languages = await this.prisma.$queryRaw`
    SELECT l1.code AS learninglanguage, l2.code AS nativelanguage
    FROM languages AS l1
    CROSS JOIN languages AS l2
    WHERE l1.code > l2.code;
    `;

    return (languages as any[]).map((item) => ({
      learningLanguage: item.learninglanguage,
      nativeLanguage: item.nativelanguage,
    }));
  }

  async save(language: Language): Promise<void> {
    const { name, code, isEnable } = language;

    await this.prisma.language.upsert({
      where: {
        code: code,
      },
      update: {
        name: name,
        code: code,
        isAvailable: isEnable,
      },
      create: {
        name: name,
        code: code,
        isAvailable: isEnable,
      },
    });
  }
}
