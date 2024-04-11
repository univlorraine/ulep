import { LearningLanguage } from 'src/core/models';
import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { TestedLanguageRepository } from 'src/core/ports/tested-language.repository';
import { TestedLanguage } from 'src/core/models/tested-language.model';

@Injectable()
export class PrismaTestedLanguageRepository
  implements TestedLanguageRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(profileId: string, item: TestedLanguage): Promise<void> {
    await this.prisma.testedLanguages.create({
      data: {
        Profile: {
          connect: {
            id: profileId,
          },
        },
        LanguageCode: {
          connect: {
            id: item.language.id,
          },
        },
        level: item.level,
      },
    });
  }

  async delete(profileId: string, languageCode: string): Promise<void> {
    await this.prisma.testedLanguages.delete({
      where: {
        profile_id_language_code_id: {
          profile_id: profileId,
          language_code_id: languageCode,
        },
      },
    });
  }

  async update(profileId: string, item: TestedLanguage): Promise<void> {
    await this.prisma.testedLanguages.update({
      where: {
        profile_id_language_code_id: {
          profile_id: profileId,
          language_code_id: item.language.id,
        },
      },
      data: {
        level: item.level,
      },
    });
  }
}
