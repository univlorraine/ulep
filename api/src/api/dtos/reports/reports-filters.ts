import * as Swagger from '@nestjs/swagger';
import { SortOrder } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';
import { ReportStatus } from 'src/core/models';

export type ReportQuerySortKey = 'firstname' | 'lastname' | 'university';

export class GetReportsQueryParams extends PaginationDto {
  @Swagger.ApiProperty({ type: ReportStatus })
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  status?: ReportStatus;

  @Swagger.ApiProperty({ type: 'string' })
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  field?: ReportQuerySortKey;

  @Swagger.ApiProperty({ type: 'string' })
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
