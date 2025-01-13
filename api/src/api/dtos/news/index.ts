import * as Swagger from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { News, NewsStatus, NewsTranslation } from 'src/core/models';
import { MediaObjectResponse } from '../medias';
import { PaginationDto } from '../pagination';
import { UniversityResponse } from '../universities';

export class GetNewsQuery extends PaginationDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  languageCodes?: string[];
}
export class GetNewsAdminQuery extends PaginationDto {
  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  universityIds?: string[];

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  status?: NewsStatus;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  languageCodes?: string[];
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
  translations: NewsTranslation[];

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  status: NewsStatus;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  startPublicationDate: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  endPublicationDate: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsString()
  creditImage?: string;
}

export class UpdateNewsRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

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
  translations: NewsTranslation[];

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  status: NewsStatus;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  startPublicationDate: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  endPublicationDate: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsString()
  creditImage?: string;
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
  translations: NewsTranslationResponse[];

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
  imageURL?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  creditImage?: string;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  updatedAt: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  startPublicationDate: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  endPublicationDate: Date;

  constructor(partial: Partial<NewsResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: News) {
    return new NewsResponse({
      id: instance.id,
      title: instance.title,
      content: instance.content,
      status: instance.status,
      imageURL: instance.imageURL,
      languageCode: instance.languageCode,
      translations: instance.translations.map(
        NewsTranslationResponse.fromDomain,
      ),
      university: UniversityResponse.fromUniversity(instance.university),
      startPublicationDate: instance.startPublicationDate,
      endPublicationDate: instance.endPublicationDate,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
      creditImage: instance.creditImage,
    });
  }
}

export class NewsTranslationResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageCode: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  constructor(partial: Partial<NewsTranslationResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: NewsTranslation) {
    return new NewsTranslationResponse({
      languageCode: instance.languageCode,
      title: instance.title,
      content: instance.content,
    });
  }
}
