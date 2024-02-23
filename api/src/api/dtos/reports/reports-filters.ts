import * as Swagger from '@nestjs/swagger';
import { SortOrder } from '@app/common';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';
import { ReportStatus } from 'src/core/models';
import { ReportQuerySortKey } from 'src/core/ports/report.repository';

export class GetReportsQueryParams extends PaginationDto {
  @Swagger.ApiPropertyOptional({ type: ReportStatus })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  universityId?: string;

  @Swagger.ApiPropertyOptional({
    type: 'string',
    enum: [
      'firstname',
      'lastname',
      'university',
      'content',
      'status',
      'createdAt',
    ],
  })
  @IsOptional()
  field?: ReportQuerySortKey;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
