import * as Swagger from '@nestjs/swagger';
import { SortOrder } from '@app/common';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';
import { ReportStatus } from 'src/core/models';

export type ReportQuerySortKey = 'firstname' | 'lastname' | 'university';

export class GetReportsQueryParams extends PaginationDto {
  @Swagger.ApiPropertyOptional({ type: ReportStatus })
  @IsOptional()
  status?: ReportStatus;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  field?: ReportQuerySortKey;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
