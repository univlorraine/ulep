import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  Activity,
  ActivityTheme,
  ActivityThemeCategory,
  ActivityVocabulary,
} from 'src/core/models/activity.model';
import {
  ActivityRepository,
  CreateActivityProps,
  CreateActivityThemeCategoryProps,
  CreateActivityThemeProps,
  GetActivitiesProps,
  UpdateActivityProps,
  UpdateActivityThemeCategoryProps,
  UpdateActivityThemeProps,
} from 'src/core/ports/activity.repository';
import {
  activityMapper,
  ActivityRelations,
  activityThemeCategoryMapper,
  ActivityThemeCategoryRelations,
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
        metadata: props.metadata,
        ressource_url: props.ressourceUrl,
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
            order: Number(exercise.order),
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

  async all(
    props: GetActivitiesProps,
  ): Promise<{ items: Activity[]; totalItems: number }> {
    let where: Prisma.ActivityWhereInput = {};

    if (props.languagesCodes) {
      where.LanguageCode = {
        code: {
          in: props.languagesCodes,
        },
      };
    }

    if (props.themesIds) {
      where.ActivityThemes = {
        id: {
          in: props.themesIds,
        },
      };
    }

    if (props.languageLevels) {
      where.language_level = {
        in: props.languageLevels,
      };
    }

    if (props.themesIds) {
      where.ActivityThemes = {
        id: {
          in: props.themesIds,
        },
      };
    }

    if (props.searchTitle) {
      where.title = {
        contains: props.searchTitle,
        mode: 'insensitive',
      };
    }

    if (props.profileId) {
      where.Creator = {
        id: props.profileId,
      };
    }

    if (props.status) {
      where.status = {
        in: props.status,
      };
    }

    const activities = await this.prisma.activity.findMany({
      where,
      skip: props.pagination?.page
        ? (props.pagination.page - 1) * props.pagination.limit
        : 0,
      take: props.pagination?.limit,
      ...ActivityRelations,
    });

    const totalActivities = await this.prisma.activity.count({
      where,
    });

    return {
      items: activities.map(activityMapper),
      totalItems: totalActivities,
    };
  }

  async allThemes(): Promise<ActivityThemeCategory[]> {
    const activityThemesCategories =
      await this.prisma.activityThemeCategories.findMany({
        ...ActivityThemeCategoryRelations,
      });

    return activityThemesCategories.map(activityThemeCategoryMapper);
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

    if (!activityTheme) {
      return null;
    }

    return activityThemeMapper(activityTheme);
  }

  async ofVocabularyId(vocabularyId: string): Promise<ActivityVocabulary> {
    const vocabulary = await this.prisma.activityVocabulary.findUnique({
      where: {
        id: vocabularyId,
      },

      ...ActivityVocabularyRelations,
    });

    if (!vocabulary) {
      return null;
    }

    return activityVocabularyMapper(vocabulary);
  }

  async ofCategoryThemeId(id: string): Promise<ActivityThemeCategory> {
    const activityThemeCategory =
      await this.prisma.activityThemeCategories.findUnique({
        where: {
          id,
        },
        ...ActivityThemeCategoryRelations,
      });

    if (!activityThemeCategory) {
      return null;
    }

    return activityThemeCategoryMapper(activityThemeCategory);
  }

  async ofCategoryThemeName(name: string): Promise<ActivityThemeCategory> {
    const activityThemeCategory =
      await this.prisma.activityThemeCategories.findFirst({
        where: { TextContent: { text: name } },
        ...ActivityThemeCategoryRelations,
      });

    if (!activityThemeCategory) {
      return null;
    }

    return activityThemeCategoryMapper(activityThemeCategory);
  }

  async createThemeCategory(
    props: CreateActivityThemeCategoryProps,
  ): Promise<ActivityThemeCategory> {
    const activityThemeCategory =
      await this.prisma.activityThemeCategories.create({
        data: {
          TextContent: {
            create: {
              text: props.content,
              LanguageCode: { connect: { code: props.languageCode } },
              Translations: {
                create: props.translations?.map((translation) => ({
                  text: translation.content,
                  LanguageCode: { connect: { code: translation.language } },
                })),
              },
            },
          },
        },
        ...ActivityThemeCategoryRelations,
      });

    return activityThemeCategoryMapper(activityThemeCategory);
  }

  async deleteActivity(id: string): Promise<void> {
    await this.prisma.activity.delete({
      where: { id },
    });
  }

  async updateThemeCategory(
    props: UpdateActivityThemeCategoryProps,
  ): Promise<ActivityThemeCategory> {
    await this.prisma.textContent.update({
      where: { id: props.textContentId },
      data: {
        text: props.content,
        LanguageCode: { connect: { code: props.languageCode } },
        Translations: {
          deleteMany: {},
          create: props.translations?.map((translation) => ({
            text: translation.content,
            LanguageCode: { connect: { code: translation.language } },
          })),
        },
      },
    });

    const newActivityThemeCategory =
      await this.prisma.activityThemeCategories.findUnique({
        where: {
          id: props.id,
        },
        ...ActivityThemeCategoryRelations,
      });

    return activityThemeCategoryMapper(newActivityThemeCategory);
  }

  async deleteCategoryTheme(id: string): Promise<void> {
    await this.prisma.activityThemeCategories.delete({
      where: { id },
    });
  }

  async ofThemeNameAndCategoryId(
    categoryId: string,
    name: string,
  ): Promise<ActivityTheme> {
    const activityTheme = await this.prisma.activityThemes.findFirst({
      where: {
        AND: [
          { Category: { id: categoryId } },
          { TextContent: { text: name } },
        ],
      },
      ...ActivityThemeRelations,
    });

    if (!activityTheme) {
      return null;
    }

    return activityThemeMapper(activityTheme);
  }

  async createTheme(props: CreateActivityThemeProps): Promise<ActivityTheme> {
    const activityTheme = await this.prisma.activityThemes.create({
      data: {
        Category: { connect: { id: props.categoryId } },
        TextContent: {
          create: {
            text: props.content,
            LanguageCode: { connect: { code: props.languageCode } },
            Translations: {
              create: props.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
      },
      ...ActivityThemeRelations,
    });

    return activityThemeMapper(activityTheme);
  }

  async updateTheme(props: UpdateActivityThemeProps): Promise<ActivityTheme> {
    await this.prisma.textContent.update({
      where: { id: props.textContentId },
      data: {
        text: props.content,
        LanguageCode: { connect: { code: props.languageCode } },
        Translations: {
          deleteMany: {},
          create: props.translations?.map((translation) => ({
            text: translation.content,
            LanguageCode: { connect: { code: translation.language } },
          })),
        },
      },
    });

    const newActivityTheme = await this.prisma.activityThemes.findUnique({
      where: {
        id: props.id,
      },
      ...ActivityThemeRelations,
    });

    return activityThemeMapper(newActivityTheme);
  }

  async updateActivity(props: UpdateActivityProps): Promise<Activity> {
    const data: Prisma.ActivityUpdateInput = {};

    if (props.languageCode) {
      data.LanguageCode = {
        connect: {
          code: props.languageCode,
        },
      };
    }

    if (props.themeId) {
      data.ActivityThemes = {
        connect: {
          id: props.themeId,
        },
      };
    }

    await this.prisma.activity.update({
      where: { id: props.id },
      data: {
        title: props.title,
        description: props.description,
        language_level: props.languageLevel,
        credit_image: props.creditImage,
        metadata: props.metadata,
        ressource_url: props.ressourceUrl,
        status: props.status,
        ...data,
        ActivityExercises: {
          deleteMany: {},
          create: props.exercises.map((exercise) => ({
            order: Number(exercise.order),
            content: exercise.content,
          })),
        },
      },
    });

    const updatedActivity = await this.prisma.activity.findUnique({
      where: { id: props.id },
      ...ActivityRelations,
    });

    return activityMapper(updatedActivity);
  }

  async deleteTheme(id: string): Promise<void> {
    await this.prisma.activityThemes.delete({
      where: { id },
    });
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    await this.prisma.activityExercises.delete({
      where: { id: exerciseId },
    });
  }

  async deleteVocabulary(vocabularyId: string): Promise<void> {
    await this.prisma.activityVocabulary.delete({
      where: { id: vocabularyId },
    });
  }
}
