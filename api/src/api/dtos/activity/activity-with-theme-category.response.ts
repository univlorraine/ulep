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
