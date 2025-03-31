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
import { Prisma } from '@prisma/client';
import {
  Activity,
  ActivityStatus,
  ActivityTheme,
  ActivityThemeCategory,
  ActivityVocabulary,
} from 'src/core/models/activity.model';
import {
  ActivityRepository,
  CreateActivityProps,
  CreateActivityThemeCategoryProps,
  CreateActivityThemeProps,
  GetActivitiesForAdminProps,
  GetActivitiesProps,
  GetAllActivityThemesProps,
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
  activityWithCategoryMapper,
  ActivityWithThemeWithCategoryRelations,
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
        University: {
          connect: {
            id: props.universityId,
          },
        },
        LanguageCode: {
          connect: {
            code: props.languageCode,
          },
        },
        ...(props.profileId && {
          Creator: {
            connect: {
              id: props.profileId,
            },
          },
        }),
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
    const where: Prisma.ActivityWhereInput = {};

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

    if (props.searchTitle) {
      where.title = {
        contains: props.searchTitle,
        mode: 'insensitive',
      };
    }

    if (props.shouldOnlyTakeMine) {
      where.Creator = {
        id: props.profileId,
      };
    } else {
      where.OR = [
        {
          Creator: {
            id: props.profileId,
          },
        },
        {
          status: {
            in: [ActivityStatus.PUBLISHED],
          },
        },
      ];
    }

    const activities = await this.prisma.activity.findMany({
      where,
      skip: props.pagination?.page
        ? (props.pagination.page - 1) * props.pagination.limit
        : 0,
      take: props.pagination?.limit,
      orderBy: {
        updated_at: 'desc',
      },
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

  async allWithThemeWithCategory(
    props: GetActivitiesForAdminProps,
  ): Promise<{ items: Activity[]; totalItems: number }> {
    const where: Prisma.ActivityWhereInput = {};

    if (props.languageCode) {
      where.LanguageCode = {
        id: props.languageCode,
      };
    }

    if (props.languageLevel) {
      where.language_level = {
        equals: props.languageLevel,
      };
    }

    if (props.searchTitle) {
      where.title = {
        contains: props.searchTitle,
        mode: 'insensitive',
      };
    }

    if (props.category) {
      where.ActivityThemes = {
        Category: {
          id: props.category,
        },
      };
    }

    if (props.theme) {
      where.ActivityThemes = {
        id: props.theme,
      };
    }

    if (props.university) {
      where.University = {
        id: props.university,
      };
    }

    if (props.status) {
      where.status = {
        in: props.status,
      };
    }

    // Get all created activities by the current university ( exclude draft activities created by the users )
    if (props.currentUserUniversityId) {
      where.OR = [
        {
          AND: [
            { University: { id: props.currentUserUniversityId } },
            { status: { equals: ActivityStatus.DRAFT } },
            { Creator: { is: null } },
          ],
        },
        {
          AND: [
            {
              status: {
                not: ActivityStatus.DRAFT,
              },
            },
          ],
        },
      ];
    }

    const activities = await this.prisma.activity.findMany({
      where,
      skip: props.pagination?.page
        ? (props.pagination.page - 1) * props.pagination.limit
        : 0,
      take: props.pagination?.limit,
      orderBy: {
        updated_at: 'desc',
      },
      ...ActivityWithThemeWithCategoryRelations,
    });

    const totalActivities = await this.prisma.activity.count({
      where,
    });

    return {
      items: activities.map(activityWithCategoryMapper),
      totalItems: totalActivities,
    };
  }

  async allThemes(
    props: GetAllActivityThemesProps,
  ): Promise<{ items: ActivityThemeCategory[]; totalItems: number }> {
    const count = await this.prisma.activityThemeCategories.count();

    const activityThemesCategories =
      await this.prisma.activityThemeCategories.findMany({
        skip: props.pagination?.page
          ? (props.pagination.page - 1) * props.pagination.limit
          : 0,
        take: props.pagination?.limit,
        ...ActivityThemeCategoryRelations,
      });

    return {
      items: activityThemesCategories.map(activityThemeCategoryMapper),
      totalItems: count,
    };
  }

  async ofId(id: string): Promise<Activity> {
    const activity = await this.prisma.activity.findUnique({
      where: {
        id,
      },
      ...ActivityWithThemeWithCategoryRelations,
    });

    if (!activity) {
      return null;
    }

    return activityWithCategoryMapper(activity);
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

  async updateActivityStatus(
    id: string,
    status: ActivityStatus,
  ): Promise<Activity> {
    await this.prisma.activity.update({
      where: { id },
      data: {
        status: status,
      },
    });

    const updatedActivity = await this.prisma.activity.findUnique({
      where: { id: id },
      ...ActivityRelations,
    });

    return activityMapper(updatedActivity);
  }

  async updateVocabulary(
    id: string,
    content: string,
  ): Promise<ActivityVocabulary> {
    await this.prisma.activityVocabulary.update({
      where: { id },
      data: {
        content: content,
      },
    });

    const updatedVocabulary = await this.prisma.activityVocabulary.findUnique({
      where: { id },
      ...ActivityVocabularyRelations,
    });

    return activityVocabularyMapper(updatedVocabulary);
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

  async countActivitiesByProfileAndStatus(
    profileId: string,
    status: ActivityStatus,
  ): Promise<number> {
    return this.prisma.activity.count({
      where: { Creator: { id: profileId }, status: status },
    });
  }
}
