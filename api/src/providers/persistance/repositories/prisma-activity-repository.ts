import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import {
  Activity,
  ActivityTheme,
  ActivityVocabulary,
} from 'src/core/models/activity.model';
import {
  ActivityRepository,
  CreateActivityProps,
} from 'src/core/ports/activity.repository';
import {
  activityMapper,
  ActivityRelations,
  activityThemeMapper,
  ActivityThemeRelations,
  activityVocabularyMapper,
  ActivityVocabularyRelations,
} from 'src/providers/persistance/mappers/activity.mapper';

@Injectable()
export class PrismaActivityRepository implements ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createActivity(props: CreateActivityProps): Promise<Activity> {
    const activity = await this.prisma.activity.create({
      data: {
        title: props.title,
        description: props.description,
        language_level: props.languageLevel,
        credit_image: props.creditImage,
        LanguageCode: {
          connect: {
            code: props.languageCode,
          },
        },
        Creator: {
          connect: {
            id: props.profileId,
          },
        },
        ActivityThemes: {
          connect: {
            id: props.themeId,
          },
        },
        ActivityExercises: {
          create: props.exercises.map((exercise) => ({
            order: exercise.order,
            content: exercise.content,
          })),
        },
      },
      ...ActivityRelations,
    });

    return activityMapper(activity);
  }

  async createVocabularyForActivity(
    activityId: string,
    vocabulary: string,
  ): Promise<ActivityVocabulary> {
    const vocabularyActivity = await this.prisma.activityVocabulary.create({
      data: {
        content: vocabulary,
        Activity: {
          connect: {
            id: activityId,
          },
        },
      },

      ...ActivityVocabularyRelations,
    });

    return activityVocabularyMapper(vocabularyActivity);
  }

  async ofId(id: string): Promise<Activity> {
    const activity = await this.prisma.activity.findUnique({
      where: {
        id,
      },
      ...ActivityRelations,
    });

    if (!activity) {
      return null;
    }

    return activityMapper(activity);
  }

  async ofThemeId(themeId: string): Promise<ActivityTheme> {
    const activityTheme = await this.prisma.activityThemes.findUnique({
      where: {
        id: themeId,
      },
      ...ActivityThemeRelations,
    });

    return activityThemeMapper(activityTheme);
  }
}
