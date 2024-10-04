import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ActivityExerciseResponse,
  ActivityThemeCategoryResponse,
  ActivityVocabularyResponse,
  LanguageResponse,
  ProfileResponse,
  UniversityResponse,
} from 'src/api/dtos';
import { OGResponse } from 'src/api/dtos/chat';
import { MediaObjectResponse } from 'src/api/dtos/medias';
import {
  TextContentResponse,
  textContentTranslationResponse,
} from 'src/api/dtos/text-content';
import {
  Activity,
  ActivityStatus,
  ActivityTheme,
} from 'src/core/models/activity.model';

export class ActivityThemeWithCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: () => TextContentResponse })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: () => ActivityThemeCategoryResponse })
  @Expose({ groups: ['read'] })
  category: ActivityThemeCategoryResponse;

  constructor(partial: Partial<ActivityThemeWithCategoryResponse>) {
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

export class ActivityWithThemeCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  description: string;

  @Swagger.ApiProperty({ type: () => ProfileResponse })
  @Expose({ groups: ['read'] })
  creator?: ProfileResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  university: UniversityResponse;

  @Swagger.ApiProperty({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  status: ActivityStatus;

  @Swagger.ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  language?: LanguageResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageLevel?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  imageUrl?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  creditImage?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  ressourceUrl?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  ressourceFileUrl?: string;

  @Swagger.ApiProperty({ type: () => ActivityThemeWithCategoryResponse })
  @Expose({ groups: ['read'] })
  theme: ActivityThemeWithCategoryResponse;

  @Swagger.ApiProperty({ type: () => ActivityVocabularyResponse })
  @Expose({ groups: ['read'] })
  vocabularies: ActivityVocabularyResponse[];

  @Swagger.ApiProperty({ type: () => ActivityExerciseResponse })
  @Expose({ groups: ['read'] })
  exercises: ActivityExerciseResponse[];

  @Swagger.ApiProperty({ type: () => OGResponse })
  @Expose({ groups: ['read'] })
  ressourceOgUrl?: OGResponse;

  constructor(partial: Partial<ActivityWithThemeCategoryResponse>) {
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
