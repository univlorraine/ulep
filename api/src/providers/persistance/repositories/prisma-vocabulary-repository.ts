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
    const data = {
      word: props.word,
      translation: props.translation,
      VocabularyList: {
        connect: {
          id: props.vocabularyListId,
        },
      },
    };

    if (props.translation) {
      data.translation = props.translation;
    }

    const vocabulary = await this.prisma.vocabulary.create({
      data,
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
    languageCode?: string,
    pagination?: VocabularyPagination,
  ): Promise<VocabularyList[]> {
    const vocabularyLists = await this.prisma.vocabularyList.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                OR: [
                  {
                    Creator: {
                      id: profileId,
                    },
                  },
                  {
                    Readers: {
                      some: {
                        id: profileId,
                      },
                    },
                  },
                ],
              },
              {
                OriginalLanguage: {
                  code: languageCode,
                },
              },
            ],
          },
          {
            AND: [
              {
                OR: [
                  {
                    Editors: {
                      some: {
                        id: profileId,
                      },
                    },
                  },
                  {
                    Readers: {
                      some: {
                        id: profileId,
                      },
                    },
                  },
                ],
              },
              {
                TranslationLanguage: {
                  code: languageCode,
                },
              },
            ],
          },
        ],
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

  async findAllVocabularyFromSelectedListsId(
    vocabularySelectedListsId: string[],
    pagination?: VocabularyPagination,
  ): Promise<Vocabulary[]> {
    const vocabulary = await this.prisma.vocabulary.findMany({
      where: {
        vocabulary_list_id: {
          in: vocabularySelectedListsId,
        },
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
          set: [],
          connect: props.profileIds.map((profileId) => ({
            id: profileId,
          })),
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

  async addReaderToVocabularyList(
    vocabularyListId: string,
    profileId: string,
  ): Promise<void> {
    await this.prisma.vocabularyList.update({
      where: { id: vocabularyListId },
      data: {
        Readers: {
          connect: {
            id: profileId,
          },
        },
      },
    });
  }

  async removeReaderFromVocabularyList(
    vocabularyListId: string,
    profileId: string,
  ): Promise<void> {
    await this.prisma.vocabularyList.update({
      where: { id: vocabularyListId },
      data: {
        Readers: {
          disconnect: {
            id: profileId,
          },
        },
      },
    });
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

  async countVocabulariesByProfileAndLanguage(
    profileId: string,
    language: string,
  ): Promise<number> {
    return await this.prisma.vocabulary.count({
      where: {
        VocabularyList: {
          AND: [
            {
              Creator: {
                id: profileId,
              },
            },
            {
              OriginalLanguage: {
                code: language,
              },
            },
          ],
        },
      },
    });
  }
}
