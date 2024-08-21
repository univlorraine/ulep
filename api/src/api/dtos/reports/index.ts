import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  TextContentResponse,
  textContentTranslationResponse,
} from 'src/api/dtos/text-content';
import { UserResponse } from 'src/api/dtos/users';
import { Translation } from 'src/core/models';
import {
  Report,
  ReportCategory,
  ReportStatus,
} from 'src/core/models/report.model';
import {
  CreateReportCommand,
  UpdateReportStatusCommand,
} from 'src/core/usecases/report';

export class CreateReportCategoryRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class UpdateReportCategoryRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class CreateReportRequest implements Omit<CreateReportCommand, 'owner'> {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  category: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateReportMessageRequest
  implements Omit<CreateReportCommand, 'owner' | 'category'>
{
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  filePath?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  mediaType?: string;
}

export class UpdateReportStatusRequest
  implements Omit<UpdateReportStatusCommand, 'id'>
{
  @Swagger.ApiProperty({ type: 'string', enum: ReportStatus })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  comment: string;
}

export class ReportCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<ReportCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    entity: ReportCategory,
    languageCode?: string,
  ): ReportCategoryResponse {
    const name = textContentTranslationResponse({
      textContent: entity.name,
      languageCode,
    });

    return new ReportCategoryResponse({
      id: entity.id,
      name: name,
    });
  }
}

export class GetReportCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: () => TextContentResponse })
  @Expose({ groups: ['read'] })
  name: TextContentResponse;

  constructor(partial: Partial<GetReportCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(entity: ReportCategory): GetReportCategoryResponse {
    return new GetReportCategoryResponse({
      id: entity.id,
      name: TextContentResponse.fromDomain(entity.name),
    });
  }
}

class ReportMetadataResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  filePath: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  mediaType: string;

  constructor(partial: Partial<ReportMetadataResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: any): ReportMetadataResponse {
    return new ReportMetadataResponse({
      filePath: instance.filePath,
      mediaType: instance.mediaType,
    });
  }
}

export class ReportResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  category: ReportCategoryResponse;

  @Swagger.ApiProperty({ type: 'string', enum: ReportStatus })
  @Expose({ groups: ['read'] })
  status: ReportStatus;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiPropertyOptional({ type: () => UserResponse })
  @Expose({ groups: ['read'] })
  user?: UserResponse;

  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  comment?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  metadata?: ReportMetadataResponse;

  constructor(partial: Partial<ReportResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Report, languageCode?: string): ReportResponse {
    return new ReportResponse({
      id: instance.id,
      category: ReportCategoryResponse.fromDomain(
        instance.category,
        languageCode,
      ),
      status: instance.status,
      content: instance.content,
      user: instance.user ? UserResponse.fromDomain(instance.user) : undefined,
      createdAt: instance.createdAt,
      comment: instance.comment,
      metadata: instance.metadata
        ? ReportMetadataResponse.fromDomain(instance.metadata)
        : undefined,
    });
  }
}
