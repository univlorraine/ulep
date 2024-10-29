import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CustomLearningGoal } from 'src/core/models';
import {
  CreateCustomLearningGoalProps,
  CustomLearningGoalRepository,
  UpdateCustomLearningGoalProps,
} from 'src/core/ports/custom-learning-goal.repository';
import { customLearningGoalMapper } from '../mappers/customLearningGoal.mapper';

@Injectable()
export class PrismaCustomLearningGoalRepository
  implements CustomLearningGoalRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<CustomLearningGoal | null> {
    const customLearningGoal = await this.prisma.customLearningGoals.findUnique(
      {
        where: { id },
      },
    );
    return customLearningGoal
      ? customLearningGoalMapper(customLearningGoal)
      : null;
  }

  async create(
    props: CreateCustomLearningGoalProps,
  ): Promise<CustomLearningGoal> {
    const customLearningGoal = await this.prisma.customLearningGoals.create({
      data: {
        title: props.title,
        description: props.description,
        LearningLanguage: {
          connect: { id: props.learningLanguageId },
        },
      },
    });
    return customLearningGoalMapper(customLearningGoal);
  }

  async update(
    props: UpdateCustomLearningGoalProps,
  ): Promise<CustomLearningGoal> {
    const customLearningGoal = await this.prisma.customLearningGoals.update({
      where: { id: props.id },
      data: props,
    });
    return customLearningGoalMapper(customLearningGoal);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customLearningGoals.delete({ where: { id } });
  }

  async findAllByLearningLanguageId(
    learningLanguageId: string,
  ): Promise<CustomLearningGoal[]> {
    const customLearningGoals = await this.prisma.customLearningGoals.findMany({
      where: { learning_language_id: learningLanguageId },
    });

    return customLearningGoals.map(customLearningGoalMapper);
  }
}
