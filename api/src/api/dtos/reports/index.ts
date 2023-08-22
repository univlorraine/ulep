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
import { textContentTranslationResponse } from 'src/api/dtos/text-content';
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

export class CreateReportRequest implements Omit<CreateReportCommand, 'owner'> {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  category: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateReportStatusRequest
  implements Omit<UpdateReportStatusCommand, 'id'>
{
  @Swagger.ApiProperty({ type: 'string', enum: ReportStatus })
  @IsEnum(ReportStatus)
  status: ReportStatus;
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
    const name = textContentTranslationResponse(entity.name, languageCode);

    return new ReportCategoryResponse({
      id: entity.id,
      name: name,
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

  @Swagger.ApiProperty({ type: UserResponse })
  @Expose({ groups: ['read'] })
  user: UserResponse;

  constructor(partial: Partial<ReportResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Report): ReportResponse {
    return new ReportResponse({
      id: instance.id,
      category: ReportCategoryResponse.fromDomain(instance.category),
      status: instance.status,
      content: instance.content,
      user: UserResponse.fromDomain(instance.user),
    });
  }
}
