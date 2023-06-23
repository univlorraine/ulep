import { Injectable } from '@nestjs/common';
import { LanguageRepository } from '../../../core/ports/language.repository';
import { PrismaService } from '../prisma.service';
import { Collection } from '../../../shared/types/collection';
import { Language } from '../../../core/models/language';
import { languageMapper } from '../mappers/language.mapper';

@Injectable()
export class PrismaLanguageRepository implements LanguageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async of(id: string): Promise<Language | null> {
    const language = await this.prisma.languageCode.findUnique({
      where: {
        id: id,
      },
    });

    if (!language) {
      return null;
    }

    return languageMapper(language);
  }

  async all(offset?: number, limit?: number): Promise<Collection<Language>> {
    const total = await this.prisma.languageCode.count();
    const languages = await this.prisma.languageCode.findMany({
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

  async where(query: { code?: string }): Promise<Language | null> {
    const instance = await this.prisma.languageCode.findFirst({
      where: {
        code: query.code,
      },
    });

    if (!instance) {
      return null;
    }

    return languageMapper(instance);
  }

  async save(language: Language): Promise<void> {
    const { id, name, code, isEnable } = language;

    await this.prisma.languageCode.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        code: code,
        isEnable: isEnable,
      },
      create: {
        id: id,
        name: name,
        code: code,
        isEnable: isEnable,
      },
    });
  }
}
