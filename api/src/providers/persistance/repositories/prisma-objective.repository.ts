import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { LearningObjective } from 'src/core/models';
import { LearningObjectiveRepository } from 'src/core/ports/objective.repository';
import {
  ObjectivesRelations,
  objectiveMapper,
} from 'src/providers/persistance/mappers/objective.mapper';

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
            Translations: {
              create: instance.name.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
      },
      include: ObjectivesRelations,
    });

    return objectiveMapper(objective);
  }

  async ofId(id: string): Promise<LearningObjective | null> {
    const objective = await this.prisma.learningObjectives.findUnique({
      where: { id },
      include: ObjectivesRelations,
    });

    if (!objective) {
      return null;
    }

    return objectiveMapper(objective);
  }

  async ofName(name: string): Promise<LearningObjective | null> {
    const objective = await this.prisma.learningObjectives.findFirst({
      where: { TextContent: { text: { equals: name } } },
      include: ObjectivesRelations,
    });

    if (!objective) {
      return null;
    }

    return objectiveMapper(objective);
  }

  async all(): Promise<LearningObjective[]> {
    const objectives = await this.prisma.learningObjectives.findMany({
      include: ObjectivesRelations,
    });

    return objectives.map((objective) => {
      return objectiveMapper(objective);
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

  async update(instance: LearningObjective): Promise<LearningObjective> {
    await this.prisma.textContent.update({
      where: {
        id: instance.name.id,
      },
      data: {
        text: instance.name.content,
        LanguageCode: { connect: { code: instance.name.language } },
        Translations: {
          deleteMany: {},
          create: instance.name.translations?.map((translation) => ({
            text: translation.content,
            LanguageCode: { connect: { code: translation.language } },
          })),
        },
      },
    });

    const objective = await this.prisma.learningObjectives.findUnique({
      where: {
        id: instance.id,
      },
      include: ObjectivesRelations,
    });

    return objectiveMapper(objective);
  }
}
