import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
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
  ActivityExercise,
  ActivityStatus,
  ActivityTheme,
  ActivityThemeCategory,
  ActivityVocabulary,
} from 'src/core/models/activity.model';

export class ActivityThemeResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: () => TextContentResponse })
  @Expose({ groups: ['read'] })
  content: string;

  constructor(partial: Partial<ActivityThemeResponse>) {
    Object.assign(this, partial);
  }

  static from(
    activityTheme: ActivityTheme,
    languageCode?: string,
  ): ActivityThemeResponse {
    return new ActivityThemeResponse({
      id: activityTheme.id,
      content: textContentTranslationResponse({
        textContent: activityTheme.content,
        languageCode,
      }),
    });
  }
}

export class GetActivityThemeResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: () => TextContentResponse })
  @Expose({ groups: ['read'] })
  content: TextContentResponse;

  constructor(partial: Partial<GetActivityThemeResponse>) {
    Object.assign(this, partial);
  }

  static from(category: ActivityTheme) {
    return new GetActivityThemeResponse({
      id: category.id,
      content: TextContentResponse.fromDomain(category.content),
    });
  }
}

export class ActivityThemeCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: () => ActivityThemeResponse })
  @Expose({ groups: ['read'] })
  themes?: ActivityThemeResponse[];

  constructor(partial: Partial<ActivityThemeCategoryResponse>) {
    Object.assign(this, partial);
  }

  static from(
    activityThemeCategory: ActivityThemeCategory,
    languageCode?: string,
  ): ActivityThemeCategoryResponse {
    return new ActivityThemeCategoryResponse({
      id: activityThemeCategory.id,
      content: textContentTranslationResponse({
        textContent: activityThemeCategory.content,
        languageCode: languageCode,
      }),
      themes:
        activityThemeCategory.themes &&
        activityThemeCategory.themes.map((theme) =>
          ActivityThemeResponse.from(theme, languageCode),
        ),
    });
  }
}

export class GetActivityThemeCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: () => TextContentResponse })
  @Expose({ groups: ['read'] })
  content: TextContentResponse;

  constructor(partial: Partial<GetActivityThemeCategoryResponse>) {
    Object.assign(this, partial);
  }

  static from(category: ActivityThemeCategory) {
    return new GetActivityThemeCategoryResponse({
      id: category.id,
      content: TextContentResponse.fromDomain(category.content),
    });
  }
}

export class ActivityVocabularyResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  pronunciationActivityVocabularyUrl: string;

  constructor(partial: Partial<ActivityVocabularyResponse>) {
    Object.assign(this, partial);
  }

  static from(
    activityVocabulary: ActivityVocabulary,
  ): ActivityVocabularyResponse {
    return new ActivityVocabularyResponse({
      id: activityVocabulary.id,
      content: activityVocabulary.content,
      pronunciationActivityVocabularyUrl:
        activityVocabulary.pronunciationActivityVocabularyUrl,
    });
  }
}

export class ActivityExerciseResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  order: number;

  constructor(partial: Partial<ActivityExerciseResponse>) {
    Object.assign(this, partial);
  }

  static from(activityExercise: ActivityExercise): ActivityExerciseResponse {
    return new ActivityExerciseResponse({
      id: activityExercise.id,
      content: activityExercise.content,
      order: activityExercise.order,
    });
  }
}

export class ActivityResponse {
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

  @Swagger.ApiProperty({ type: () => ActivityThemeResponse })
  @Expose({ groups: ['read'] })
  theme: ActivityThemeResponse;

  @Swagger.ApiProperty({ type: () => ActivityVocabularyResponse })
  @Expose({ groups: ['read'] })
  vocabularies: ActivityVocabularyResponse[];

  @Swagger.ApiProperty({ type: () => ActivityExerciseResponse })
  @Expose({ groups: ['read'] })
  exercises: ActivityExerciseResponse[];

  @Swagger.ApiProperty({ type: () => OGResponse })
  @Expose({ groups: ['read'] })
  ressourceOgUrl?: OGResponse;

  constructor(partial: Partial<ActivityResponse>) {
    Object.assign(this, partial);
  }

  static from(activity: Activity, languageCode?: string): ActivityResponse {
    return new ActivityResponse({
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
      theme: ActivityThemeResponse.from(activity.activityTheme, languageCode),
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
