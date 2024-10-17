import * as Swagger from '@nestjs/swagger';
import { SortOrder } from '@app/common';
import { IsOptional } from 'class-validator';

export class GetUniversitiesRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  field?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
