import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { Language } from 'src/core/models';
import { LanguageRepository } from 'src/core/ports/language.repository';
import { languageMapper } from '../mappers/language.mapper';

@Injectable()
export class PrismaLanguageRepository implements LanguageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<Language> {
    const languageCode = await this.prisma.languageCodes.findUnique({
      where: { id },
    });

    if (!languageCode) {
      return null;
    }

    return languageMapper(languageCode);
  }

  async ofCode(code: string): Promise<Language> {
    const languageCode = await this.prisma.languageCodes.findUnique({
      where: { code },
    });

    if (!languageCode) {
      return null;
    }

    return languageMapper(languageCode);
  }

  async all(): Promise<Language[]> {
    const languageCodes = await this.prisma.languageCodes.findMany();

    return languageCodes.map(languageMapper);
  }

  async addRequest(code: string, user: string): Promise<void> {
    await this.prisma.suggestedLanguages.create({
      data: {
        language_code_id: code,
        user_id: user,
      },
    });
  }

  async countRequests(code: string): Promise<number> {
    const count = await this.prisma.suggestedLanguages.count({
      where: { language_code_id: code },
    });

    return count;
  }
}
