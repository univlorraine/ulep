import * as Swagger from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsUUID, IsEnum, Length } from 'class-validator';
import {
  Report,
  ReportCategory,
  ReportStatus,
} from 'src/core/models/report.model';
import {
  CreateReportCategoryCommand,
  CreateReportCommand,
  UpdateReportStatusCommand,
} from 'src/core/usecases/report';

export class CreateReportCategoryRequest
  implements CreateReportCategoryCommand
{
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  // TODO: get the language code from the request headers
  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @Transform(({ value }) => value?.toLowerCase())
  @IsString()
  @Length(2, 2)
  languageCode: string;
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

  static fromDomain(entity: ReportCategory): ReportCategoryResponse {
    return new ReportCategoryResponse({
      id: entity.id,
      name: entity.name.content,
    });
  }
}

export class ReportResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  owner: string;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  category: ReportCategoryResponse;

  @Swagger.ApiProperty({ type: 'string', enum: ReportStatus })
  @Expose({ groups: ['read'] })
  status: ReportStatus;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  constructor(partial: Partial<ReportResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Report): ReportResponse {
    return new ReportResponse({
      id: instance.id,
      owner: instance.owner,
      category: ReportCategoryResponse.fromDomain(instance.category),
      status: instance.status,
      content: instance.content,
    });
  }
}
