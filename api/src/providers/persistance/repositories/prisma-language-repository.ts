import { Injectable } from '@nestjs/common';
import { LanguageRepository } from '../../../core/ports/language.repository';
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
