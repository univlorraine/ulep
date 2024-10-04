import { Prisma } from '@prisma/client';
import { MediaObject, ProficiencyLevel } from 'src/core/models';
import {
  Activity,
  ActivityExercise,
  ActivityStatus,
  ActivityTheme,
  ActivityThemeCategory,
  ActivityVocabulary,
} from 'src/core/models/activity.model';
import {
  textContentMapper,
  TextContentRelations,
  universityMapper,
  UniversityRelations,
} from 'src/providers/persistance/mappers';
import { languageMapper } from 'src/providers/persistance/mappers/language.mapper';
import {
  profileMapper,
  ProfilesRelations,
} from 'src/providers/persistance/mappers/profile.mapper';

export const ActivityVocabularyInclude =
  Prisma.validator<Prisma.ActivityVocabularyInclude>()({
    PronunciationActivityVocabulary: true,
  });

export const ActivityVocabularyRelations = {
  include: ActivityVocabularyInclude,
};

export type ActivityVocabularySnapshot = Prisma.ActivityVocabularyGetPayload<
  typeof ActivityVocabularyRelations
>;

export const activityVocabularyMapper = (
  snapshot: ActivityVocabularySnapshot,
): ActivityVocabulary => {
  return new ActivityVocabulary({
    id: snapshot.id,
    content: snapshot.content,
    pronunciationActivityVocabulary:
      snapshot.PronunciationActivityVocabulary &&
      new MediaObject({
        id: snapshot.PronunciationActivityVocabulary.id,
        name: snapshot.PronunciationActivityVocabulary.name,
        bucket: snapshot.PronunciationActivityVocabulary.bucket,
        mimetype: snapshot.PronunciationActivityVocabulary.mime,
        size: snapshot.PronunciationActivityVocabulary.size,
      }),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  });
};

export const ActivityExerciseInclude =
  Prisma.validator<Prisma.ActivityExercisesInclude>()({});

export const ActivityExerciseRelations = {
  include: ActivityExerciseInclude,
};

export type ActivityExerciseSnapshot = Prisma.ActivityExercisesGetPayload<
  typeof ActivityExerciseRelations
>;

export const activityExerciseMapper = (
  snapshot: ActivityExerciseSnapshot,
): ActivityExercise => {
  return new ActivityExercise({
    id: snapshot.id,
    content: snapshot.content,
    order: snapshot.order,
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  });
};

export const ActivityThemeInclude =
  Prisma.validator<Prisma.ActivityThemesInclude>()({
    TextContent: TextContentRelations,
  });

export const ActivityThemeRelations = {
  include: ActivityThemeInclude,
};

export type ActivityThemeSnapshot = Prisma.ActivityThemesGetPayload<
  typeof ActivityThemeRelations
>;

export const activityThemeMapper = (
  snapshot: ActivityThemeSnapshot,
): ActivityTheme => {
  return new ActivityTheme({
    id: snapshot.id,
    content: textContentMapper(snapshot.TextContent),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  });
};

export const ActivityThemeCategoryInclude =
  Prisma.validator<Prisma.ActivityThemeCategoriesInclude>()({
    TextContent: TextContentRelations,
    ActivityThemes: ActivityThemeRelations,
  });

export const ActivityThemeCategoryRelations = {
  include: ActivityThemeCategoryInclude,
};

export type ActivityThemeCategorySnapshot =
  Prisma.ActivityThemeCategoriesGetPayload<
    typeof ActivityThemeCategoryRelations
  >;

export const activityThemeCategoryMapper = (
  snapshot: ActivityThemeCategorySnapshot,
): ActivityThemeCategory => {
  return new ActivityThemeCategory({
    id: snapshot.id,
    content: textContentMapper(snapshot.TextContent),
    themes: snapshot.ActivityThemes?.map(activityThemeMapper),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  });
};

export const ActivityInclude = Prisma.validator<Prisma.ActivityInclude>()({
  ActivityExercises: true,
  ActivityVocabulary: ActivityVocabularyRelations,
  Image: true,
  LanguageCode: true,
  RessourceFile: true,
  ActivityThemes: ActivityThemeRelations,
  Creator: { include: ProfilesRelations },
  University: { include: UniversityRelations },
});

export const ActivityRelations = { include: ActivityInclude };

export type ActivitySnapshot = Prisma.ActivityGetPayload<
  typeof ActivityRelations
>;

export const activityMapper = (snapshot: ActivitySnapshot): Activity => {
  return new Activity({
    id: snapshot.id,
    title: snapshot.title,
    description: snapshot.description,
    creator: snapshot.Creator && profileMapper(snapshot.Creator),
    university: universityMapper(snapshot.University),
    image:
      snapshot.Image &&
      new MediaObject({
        id: snapshot.Image.id,
        name: snapshot.Image.name,
        bucket: snapshot.Image.bucket,
        mimetype: snapshot.Image.mime,
        size: snapshot.Image.size,
      }),
    creditImage: snapshot.credit_image,
    languageLevel: snapshot.language_level as ProficiencyLevel,
    language: languageMapper(snapshot.LanguageCode),
    status: snapshot.status as ActivityStatus,
    ressourceUrl: snapshot.ressource_url,
    ressourceFile:
      snapshot.RessourceFile &&
      new MediaObject({
        id: snapshot.RessourceFile.id,
        name: snapshot.RessourceFile.name,
        bucket: snapshot.RessourceFile.bucket,
        mimetype: snapshot.RessourceFile.mime,
        size: snapshot.RessourceFile.size,
      }),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
    activityTheme: activityThemeMapper(snapshot.ActivityThemes),
    activityVocabularies: snapshot.ActivityVocabulary?.map(
      activityVocabularyMapper,
    ),
    activityExercises: snapshot.ActivityExercises?.map(activityExerciseMapper),
    metadata: snapshot.metadata,
  });
};
