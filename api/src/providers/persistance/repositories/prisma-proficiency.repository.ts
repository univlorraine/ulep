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

import { Injectable, Logger } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { ProficiencyRepository } from 'src/core/ports/proficiency.repository';
import {
  ProficiencyLevel,
  ProficiencyQuestion,
  ProficiencyTest,
} from 'src/core/models';
import {
  ProficiencyTestRelations,
  proficiencyQuestionMapper,
  proficiencyTestMapper,
  TextContentRelations,
  ProficiencyQuestionRelations,
} from '../mappers';

@Injectable()
export class PrismaProficiencyRepository implements ProficiencyRepository {
  private readonly logger = new Logger(PrismaProficiencyRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTest(
    id: string,
    level: ProficiencyLevel,
  ): Promise<ProficiencyTest> {
    const test = await this.prisma.proficiencyTests.create({
      data: {
        id,
        level,
      },
      include: {
        Questions: {
          include: {
            TextContent: TextContentRelations,
          },
        },
      },
    });

    return proficiencyTestMapper(test);
  }

  async findAllTests(): Promise<ProficiencyTest[]> {
    const tests = await this.prisma.proficiencyTests.findMany({
      include: ProficiencyTestRelations,
    });

    return tests.map(proficiencyTestMapper);
  }

  async testOfId(id: string): Promise<ProficiencyTest> {
    const test = await this.prisma.proficiencyTests.findUnique({
      where: { id },
      include: ProficiencyTestRelations,
    });

    if (!test) {
      return null;
    }

    return proficiencyTestMapper(test);
  }

  async findAllQuestions(
    offset?: number,
    limit?: number,
    level?: ProficiencyLevel,
  ): Promise<Collection<ProficiencyQuestion>> {
    const count = await this.prisma.proficiencyQuestions.count({
      where: level ? { ProficiencyTest: { level } } : undefined,
    });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const questions = await this.prisma.proficiencyQuestions.findMany({
      where: level ? { ProficiencyTest: { level } } : undefined,
      skip: offset,
      take: limit,
      orderBy: { ProficiencyTest: { level: 'asc' } },
      include: ProficiencyQuestionRelations,
    });

    return new Collection<ProficiencyQuestion>({
      items: questions.map(proficiencyQuestionMapper),
      totalItems: count,
    });
  }

  async testOfLevel(level: ProficiencyLevel): Promise<ProficiencyTest> {
    const test = await this.prisma.proficiencyTests.findUnique({
      where: { level: level },
      include: ProficiencyTestRelations,
    });

    if (!test) {
      return null;
    }

    return proficiencyTestMapper(test);
  }

  async removeTest(level: ProficiencyLevel): Promise<void> {
    await this.prisma.proficiencyTests.delete({
      where: {
        level,
      },
    });
  }

  async createQuestion(
    testId: string,
    question: ProficiencyQuestion,
  ): Promise<ProficiencyQuestion> {
    await this.prisma.proficiencyTests.update({
      where: { id: testId },
      data: {
        Questions: {
          create: {
            id: question.id,
            TextContent: {
              create: {
                text: question.text.content,
                LanguageCode: { connect: { code: question.text.language } },
                Translations: {
                  create: question.text.translations?.map((translation) => ({
                    text: translation.content,
                    LanguageCode: { connect: { code: translation.language } },
                  })),
                },
              },
            },
            answer: question.answer,
          },
        },
      },
    });

    return question;
  }

  async questionOfId(id: string): Promise<ProficiencyQuestion> {
    const question = await this.prisma.proficiencyQuestions.findUnique({
      where: { id },
      include: ProficiencyQuestionRelations,
    });

    if (!question) {
      return null;
    }

    return proficiencyQuestionMapper(question);
  }

  async updateQuestion(
    question: ProficiencyQuestion,
  ): Promise<ProficiencyQuestion> {
    await this.prisma.textContent.update({
      where: {
        id: question.text.id,
      },
      data: {
        text: question.text.content,
        LanguageCode: { connect: { code: question.text.language } },
        Translations: {
          deleteMany: {},
          create: question.text.translations?.map((translation) => ({
            text: translation.content,
            LanguageCode: { connect: { code: translation.language } },
          })),
        },
      },
    });

    const questionUpdated = await this.prisma.proficiencyQuestions.update({
      where: {
        id: question.id,
      },
      data: {
        ProficiencyTest: {
          connect: { level: question.level },
        },
      },
      include: ProficiencyQuestionRelations,
    });

    return proficiencyQuestionMapper(questionUpdated);
  }

  async removeQuestion(id: string): Promise<void> {
    await this.prisma.proficiencyQuestions.delete({
      where: { id },
    });
  }
}
