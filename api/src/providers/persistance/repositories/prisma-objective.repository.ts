import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { LearningObjective } from 'src/core/models';
import { LearningObjectiveRepository } from 'src/core/ports/objective.repository';
import { TextContentRelations, textContentMapper } from '../mappers';

@Injectable()
export class PrismaObjectiveRepository implements LearningObjectiveRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(instance: LearningObjective): Promise<LearningObjective> {
    const objective = await this.prisma.learningObjectives.create({
      data: {
        id: instance.id,
        TextContent: {
          create: {
            id: instance.name.id,
            text: instance.name.content,
            LanguageCode: { connect: { code: instance.name.language } },
          },
        },
      },
      include: {
        TextContent: TextContentRelations,
      },
    });

    return {
      id: objective.id,
      name: textContentMapper(objective.TextContent),
    };
  }

  async ofId(id: string): Promise<LearningObjective | null> {
    const objective = await this.prisma.learningObjectives.findUnique({
      where: { id },
      include: {
        TextContent: TextContentRelations,
      },
    });

    if (!objective) {
      return null;
    }

    return {
      id: objective.id,
      name: textContentMapper(objective.TextContent),
    };
  }

  async all(): Promise<LearningObjective[]> {
    const objectives = await this.prisma.learningObjectives.findMany({
      include: {
        TextContent: TextContentRelations,
      },
    });

    return objectives.map((objective) => {
      return {
        id: objective.id,
        name: textContentMapper(objective.TextContent),
      };
    });
  }

  async delete(id: string): Promise<void> {
    const objectve = await this.ofId(id);

    if (!objectve) {
      return;
    }

    await this.prisma.learningObjectives.delete({ where: { id } });
    await this.prisma.textContent.delete({ where: { id: objectve.name.id } });
  }
}
