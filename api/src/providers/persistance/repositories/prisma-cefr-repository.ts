import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CEFRLevel, CEFRTest } from 'src/core/models/cefr';
import { CEFRRepository } from 'src/core/ports/cefr.repository';

@Injectable()
export class PrismaCEFRRepository implements CEFRRepository {
  constructor(private readonly prisma: PrismaService) {}

  async testOfLevel(level: CEFRLevel): Promise<CEFRTest> {
    const instance = await this.prisma.cEFRTest.findUnique({
      where: {
        level: level,
      },
      include: {
        questions: true,
      },
    });

    return {
      id: instance.id,
      level: level,
      questions: instance.questions.map((question) => ({
        id: question.id,
        value: question.value,
        answer: question.answer,
      })),
    };
  }
}
