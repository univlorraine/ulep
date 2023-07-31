import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/common';
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
} from '../mappers';

@Injectable()
export class PrismaProficiencyRepository implements ProficiencyRepository {
  private readonly logger = new Logger(PrismaProficiencyRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTest(level: ProficiencyLevel): Promise<ProficiencyTest> {
    const test = await this.prisma.proficiencyTests.create({
      data: {
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
      include: { TextContent: TextContentRelations },
    });

    if (!question) {
      return null;
    }

    return proficiencyQuestionMapper(question);
  }

  async updateQuestion(question: ProficiencyQuestion): Promise<void> {
    throw new Error(
      'Method not implemented, should be implemented in translations repository ?',
    );
  }

  async removeQuestion(id: string): Promise<void> {
    await this.prisma.proficiencyQuestions.delete({
      where: { id },
    });
  }
}
