import * as Swagger from '@nestjs/swagger';
import { SortOrder } from '@app/common';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetInterestsQueryParams extends PaginationDto {
  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
