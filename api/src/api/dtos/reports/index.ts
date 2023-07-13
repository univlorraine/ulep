import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Report, ReportCategory } from '../../../core/models/report';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination.dto';
import { UserResponse } from '../users/user.response';

export class ReportCategoryResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty({ type: 'string', example: 'unresponsive_tandem' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<ReportCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: ReportCategory): ReportCategoryResponse {
    return new ReportCategoryResponse({ id: instance.id, name: instance.name });
  }
}

export class ReportResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  user: UserResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  category: ReportCategoryResponse;

  @ApiProperty({
    type: 'string',
    example: 'The user is not responding to my messages',
  })
  @Expose({ groups: ['read'] })
  content: string;

  constructor(partial: Partial<ReportResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(report: Report): ReportResponse {
    return new ReportResponse({
      id: report.id,
      user: new UserResponse({
        id: report.owner.id,
        email: report.owner.email,
      }),
      category: new ReportCategoryResponse({
        id: report.category.id,
        name: report.category.name,
      }),
      content: report.content,
    });
  }
}

export class CreateReportRequest {
  @ApiProperty({ type: 'string', example: 'unresponsive_tandem' })
  @IsUUID()
  category: string;

  @ApiProperty({
    type: 'string',
    example: 'The user is not responding to my messages',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateReportCategoryRequest {
  @ApiProperty({ type: 'string', example: 'unresponsive_tandem' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ReportQueryFilter extends PaginationDto {
  @ApiPropertyOptional({
    description: 'The category name',
    example: 'unresponsive_tandem',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category: string;
}
