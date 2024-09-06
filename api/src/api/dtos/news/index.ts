import * as Swagger from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { UniversityResponse } from '../universities';
import { News, NewsStatus } from 'src/core/models';
import { MediaObjectResponse } from '../medias';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetNewsQuery {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  universityId?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  status?: NewsStatus;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  languageCode?: string;
}

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
  translations: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  status: NewsStatus;
}

export class UpdateNewsRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

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
  translations: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  status: NewsStatus;
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

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  status: string;

  @Swagger.ApiProperty({ type: MediaObjectResponse })
  @Expose({ groups: ['read'] })
  image?: MediaObjectResponse;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  updatedAt: Date;

  constructor(partial: Partial<NewsResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: News) {
    const translations = JSON.stringify(instance.translations);

    return new NewsResponse({
      id: instance.id,
      title: instance.title,
      content: instance.content,
      status: instance.status,
      image: instance.image
        ? MediaObjectResponse.fromMediaObject(instance.image)
        : null,
      languageCode: instance.languageCode,
      translations: translations,
      university: UniversityResponse.fromUniversity(instance.university),
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    });
  }
}
