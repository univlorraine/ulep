import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
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

  async allThemes(): Promise<ActivityThemeCategory[]> {
    const activityThemesCategories =
      await this.prisma.activityThemeCategories.findMany({
        ...ActivityThemeCategoryRelations,
      });

    return activityThemesCategories.map(activityThemeCategoryMapper);
  }

  async allThemeCategories(): Promise<ActivityThemeCategory[]> {
    const activityThemeCategories =
      await this.prisma.activityThemeCategories.findMany({
        ...ActivityThemeCategoryRelations,
      });

    return activityThemeCategories.map(activityThemeCategoryMapper);
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

  async deleteTheme(id: string): Promise<void> {
    await this.prisma.activityThemes.delete({
      where: { id },
    });
  }
}
