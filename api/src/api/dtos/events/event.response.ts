import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import {
  EventObject,
  EventTranslation,
  EventType,
} from 'src/core/models/event.model';
import { LanguageResponse } from '../languages';
import { UniversityResponse } from '../universities';
import { UserResponse } from '../users';

export class EventTranslationResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageCode: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  constructor(partial: Partial<EventTranslationResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: EventTranslation) {
    return new EventTranslationResponse({
      languageCode: instance.languageCode,
      title: instance.title,
      content: instance.content,
    });
  }
}

export class EventResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: [EventTranslationResponse] })
  @Expose({ groups: ['read'] })
  @IsArray()
  translations: EventTranslationResponse[];

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageCode: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  authorUniversity: UniversityResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  type: EventType;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  eventURL?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  address?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  addressName?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  deepLink?: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  withSubscription: boolean;

  @Swagger.ApiProperty({ type: [LanguageResponse] })
  @Expose({ groups: ['read'] })
  @IsArray()
  diffusionLanguages?: LanguageResponse[];

  @Swagger.ApiProperty({ type: [UniversityResponse] })
  @Expose({ groups: ['read'] })
  @IsArray()
  concernedUniversities?: UniversityResponse[];

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  status: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  imageURL?: string;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  startDate: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  endDate: Date;

  @Swagger.ApiProperty({ type: [UserResponse] })
  @Expose({ groups: ['read'] })
  @IsArray()
  enrolledUsers: UserResponse[];

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  updatedAt: Date;

  constructor(partial: Partial<EventResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: EventObject) {
    return new EventResponse({
      id: instance.id,
      title: instance.title,
      content: instance.content,
      type: instance.type,
      status: instance.status,
      eventURL: instance.eventURL,
      address: instance.address,
      addressName: instance.addressName,
      deepLink: instance.deepLink,
      withSubscription: instance.withSubscription,
      diffusionLanguages: instance.diffusionLanguages?.map((language) =>
        LanguageResponse.fromLanguage(language),
      ),
      concernedUniversities: instance.concernedUniversities?.map((university) =>
        UniversityResponse.fromUniversity(university),
      ),
      imageURL: instance.imageURL,
      languageCode: instance.languageCode,
      translations: instance.translations.map(
        EventTranslationResponse.fromDomain,
      ),
      authorUniversity: UniversityResponse.fromUniversity(
        instance.authorUniversity,
      ),
      startDate: instance.startDate,
      endDate: instance.endDate,
      enrolledUsers: instance.enrolledUsers?.map(UserResponse.fromDomain),
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    });
  }
}
