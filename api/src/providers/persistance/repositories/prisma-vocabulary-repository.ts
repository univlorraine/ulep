import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';
import {
  CreateVocabularyListProps,
  CreateVocabularyProps,
  UpdateVocabularyListProps,
  UpdateVocabularyProps,
  VocabularyPagination,
  VocabularyQueryWhere,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';
import {
  vocabularyListMapper,
  VocabularyListRelations,
  vocabularyMapper,
  VocabularyRelations,
} from 'src/providers/persistance/mappers/vocabulary.mapper';

@Injectable()
export class PrismaVocabularyRepository implements VocabularyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVocabulary(props: CreateVocabularyProps): Promise<Vocabulary> {
    const vocabulary = await this.prisma.vocabulary.create({
      data: {
        word: props.word,
        translation: props.translation,
        VocabularyList: {
          connect: {
            id: props.vocabularyListId,
          },
        },
      },
      ...VocabularyRelations,
    });

    return vocabularyMapper(vocabulary);
  }

  async createVocabularyList(
    props: CreateVocabularyListProps,
  ): Promise<VocabularyList> {
    const vocabularyList = await this.prisma.vocabularyList.create({
      data: {
        name: props.name,
        symbol: props.symbol,
        Editors: {
          connect: {
            id: props.profileId,
          },
        },
        Creator: {
          connect: {
            id: props.profileId,
          },
        },
        OriginalLanguage: {
          connect: {
            id: props.wordLanguageId,
          },
        },
        TranslationLanguage: {
          connect: {
            id: props.translationLanguageId,
          },
        },
      },
      ...VocabularyListRelations,
    });

    return vocabularyListMapper(vocabularyList);
  }

  async findAllVocabularyLists(
    profileId: string,
    pagination?: VocabularyPagination,
  ): Promise<VocabularyList[]> {
    const vocabularyLists = await this.prisma.vocabularyList.findMany({
      where: {
        Editors: {
          some: {
            id: profileId,
          },
        },
      },
      skip: pagination?.page ? (pagination.page - 1) * pagination.limit : 0,
      take: pagination?.limit,
      ...VocabularyListRelations,
    });

    return vocabularyLists.map(vocabularyListMapper);
  }

  async findAllVocabularyfromListId(
    vocabularyListId: string,
    where?: VocabularyQueryWhere,
    pagination?: VocabularyPagination,
  ): Promise<Vocabulary[]> {
    const vocabulary = await this.prisma.vocabulary.findMany({
      where: {
        AND: [
          {
            vocabulary_list_id: vocabularyListId,
            OR: [
              {
                word: {
                  contains: where?.search,
                  mode: 'insensitive',
                },
              },
              {
                translation: {
                  contains: where?.search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      skip: pagination?.page ? (pagination.page - 1) * pagination.limit : 0,
      take: pagination?.limit,
      ...VocabularyRelations,
    });

    return vocabulary.map(vocabularyMapper);
  }

  async findVocabularyListById(id: string): Promise<VocabularyList> {
    const vocabularyList = await this.prisma.vocabularyList.findUnique({
      where: {
        id,
      },
      ...VocabularyListRelations,
    });

    if (!vocabularyList) {
      return null;
    }

    return vocabularyListMapper(vocabularyList);
  }

  async findVocabularyById(id: string): Promise<Vocabulary> {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: {
        id,
      },
      ...VocabularyRelations,
    });

    if (!vocabulary) {
      return null;
    }

    return vocabularyMapper(vocabulary);
  }
  async updateVocabulary(props: UpdateVocabularyProps): Promise<Vocabulary> {
    const vocabulary = await this.prisma.vocabulary.update({
      where: {
        id: props.id,
      },
      data: {
        word: props.word,
        translation: props.translation,
      },
      ...VocabularyRelations,
    });

    return vocabularyMapper(vocabulary);
  }

  async updateVocabularyList(
    props: UpdateVocabularyListProps,
  ): Promise<VocabularyList> {
    const vocabularyList = await this.prisma.vocabularyList.update({
      where: {
        id: props.id,
      },
      data: {
        name: props.name,
        symbol: props.symbol,
        Editors: {
          connect: props.profileIds.map((profileId) => ({
            id: profileId,
          })),
        },
      },
      ...VocabularyListRelations,
    });

    return vocabularyListMapper(vocabularyList);
  }

  async deleteVocabulary(id: string): Promise<void> {
    await this.prisma.vocabulary.delete({
      where: {
        id,
      },
    });
  }

  async deleteVocabularyList(id: string): Promise<void> {
    await this.prisma.vocabularyList.delete({
      where: {
        id,
      },
    });
  }
}
