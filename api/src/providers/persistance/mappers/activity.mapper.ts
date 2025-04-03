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

export const ActivityThemeCategoryOnlyInclude =
  Prisma.validator<Prisma.ActivityThemeCategoriesInclude>()({
    TextContent: TextContentRelations,
  });

export const ActivityThemeCategoryOnlyRelations = {
  include: ActivityThemeCategoryOnlyInclude,
};

export type ActivityThemeCategoryOnlySnapshot =
  Prisma.ActivityThemeCategoriesGetPayload<
    typeof ActivityThemeCategoryOnlyRelations
  >;

export const activityThemeCategoryOnlyMapper = (
  snapshot: ActivityThemeCategoryOnlySnapshot,
): ActivityThemeCategory => {
  return new ActivityThemeCategory({
    id: snapshot.id,
    content: textContentMapper(snapshot.TextContent),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  });
};

export const activityThemeWithCategoryMapper = (
  snapshot: ActivityThemeSnapshot & {
    Category: ActivityThemeCategoryOnlySnapshot;
  },
): ActivityTheme => {
  return new ActivityTheme({
    id: snapshot.id,
    content: textContentMapper(snapshot.TextContent),
    category: activityThemeCategoryOnlyMapper(snapshot.Category),
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

export const ActivityWithThemeWithCategoryInclude = {
  ActivityExercises: true,
  ActivityVocabulary: ActivityVocabularyRelations,
  Image: true,
  LanguageCode: true,
  RessourceFile: true,
  ActivityThemes: {
    include: {
      TextContent: TextContentRelations,
      Category: { include: { TextContent: TextContentRelations } },
    },
  },
  Creator: { include: ProfilesRelations },
  University: { include: UniversityRelations },
};

export const ActivityWithThemeWithCategoryRelations = {
  include: ActivityWithThemeWithCategoryInclude,
};

export type ActivityWithThemeWithCategoryRelationsSnapshot =
  Prisma.ActivityGetPayload<typeof ActivityWithThemeWithCategoryRelations>;

export const activityWithCategoryMapper = (
  snapshot: ActivityWithThemeWithCategoryRelationsSnapshot,
): Activity => {
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
    activityTheme: activityThemeWithCategoryMapper(snapshot.ActivityThemes),
    activityVocabularies: snapshot.ActivityVocabulary?.map(
      activityVocabularyMapper,
    ),
    activityExercises: snapshot.ActivityExercises?.map(activityExerciseMapper),
    metadata: snapshot.metadata,
  });
};
