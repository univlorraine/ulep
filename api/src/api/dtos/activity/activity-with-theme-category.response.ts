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

import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ActivityExerciseResponse,
  ActivityResponse,
  ActivityThemeCategoryResponse,
  ActivityThemeResponse,
  ActivityVocabularyResponse,
  LanguageResponse,
  ProfileResponse,
  UniversityResponse,
} from 'src/api/dtos';
import { OGResponse } from 'src/api/dtos/chat';
import { textContentTranslationResponse } from 'src/api/dtos/text-content';
import { Activity, ActivityTheme } from 'src/core/models/activity.model';

export class ActivityThemeWithCategoryResponse extends ActivityThemeResponse {
  @Swagger.ApiProperty({ type: () => ActivityThemeCategoryResponse })
  @Expose({ groups: ['read'] })
  category: ActivityThemeCategoryResponse;

  constructor(partial: Partial<ActivityThemeWithCategoryResponse>) {
    super(partial);
    Object.assign(this, partial);
  }

  static from(
    activityTheme: ActivityTheme,
    languageCode?: string,
  ): ActivityThemeWithCategoryResponse {
    return new ActivityThemeWithCategoryResponse({
      id: activityTheme.id,
      content: textContentTranslationResponse({
        textContent: activityTheme.content,
        languageCode,
      }),
      category: ActivityThemeCategoryResponse.from(activityTheme.category),
    });
  }
}

export class ActivityWithThemeCategoryResponse extends ActivityResponse {
  @Swagger.ApiProperty({ type: () => ActivityThemeWithCategoryResponse })
  @Expose({ groups: ['read'] })
  theme: ActivityThemeWithCategoryResponse;

  constructor(partial: Partial<ActivityWithThemeCategoryResponse>) {
    super(partial);
    Object.assign(this, partial);
  }

  static from(
    activity: Activity,
    languageCode?: string,
  ): ActivityWithThemeCategoryResponse {
    return new ActivityWithThemeCategoryResponse({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      creator: activity.creator
        ? ProfileResponse.fromDomain(activity.creator)
        : undefined,
      university: UniversityResponse.fromUniversity(activity.university),
      status: activity.status,
      language: LanguageResponse.fromLanguage(activity.language),
      languageLevel: activity.languageLevel,
      imageUrl: activity.imageUrl,
      creditImage: activity.creditImage,
      ressourceUrl: activity.ressourceUrl,
      ressourceFileUrl: activity.ressourceFileUrl,
      theme: ActivityThemeWithCategoryResponse.from(
        activity.activityTheme,
        languageCode,
      ),
      vocabularies: activity.activityVocabularies.map(
        ActivityVocabularyResponse.from,
      ),
      exercises: activity.activityExercises.map(ActivityExerciseResponse.from),
      ressourceOgUrl: activity.metadata?.openGraph
        ? OGResponse.from(activity.metadata?.openGraph)
        : undefined,
    });
  }
}
