import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Report, ReportCategory } from '../../../core/models/report';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination.dto';

export class ReportResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  owner: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  category: ReportCategory;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  content: string;

  constructor(partial: Partial<ReportResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(report: Report): ReportResponse {
    return new ReportResponse({
      id: report.id,
      owner: report.ownerId,
      category: new ReportCategoryResponse({
        id: report.category.id,
        name: report.category.name,
      }),
      content: report.content,
    });
  }
}

export class ReportCategoryResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<ReportCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: ReportCategory): ReportCategoryResponse {
    return new ReportCategoryResponse({ id: instance.id, name: instance.name });
  }
}

export class CreateReportRequest {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateReportCategoryRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ReportQueryFilter extends PaginationDto {
  @ApiPropertyOptional({ description: 'The category name' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category: string;
}
