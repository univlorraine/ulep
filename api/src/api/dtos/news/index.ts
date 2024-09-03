import * as Swagger from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { NewsWithTranslations, University } from 'src/core/models';
import { UniversityResponse } from '../universities';

export class CreateNewsRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  universityId: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  languageCode: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  translations?: string;
}
export class NewsResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  translations: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageCode: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  university: UniversityResponse;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  updatedAt: Date;

  constructor(partial: Partial<NewsResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: NewsWithTranslations) {
    const translations = JSON.stringify(instance.translations);

    return new NewsResponse({
      id: instance.id,
      title: instance.title.content,
      content: instance.content.content,
      languageCode: instance.languageCode,
      translations: translations,
      university: UniversityResponse.fromUniversity(instance.university),
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    });
  }
}
