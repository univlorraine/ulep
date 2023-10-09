import { SortOrder } from '@app/common';
import * as Swagger from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';
import { LanguageStatus } from 'src/core/models';
import {
  LanguageFilter,
  LanguageQuerySortFilter,
} from 'src/core/ports/language.repository';

export class FindAllLanguageParams extends PaginationDto {
  @Swagger.ApiPropertyOptional({ default: true })
  @Transform(({ value }) => (value ? value === 'true' : true))
  @IsBoolean()
  @IsOptional()
  pagination?: boolean;

  @Swagger.ApiProperty({
    type: 'string',
    enum: [LanguageStatus, 'PARTNER'],
  })
  @IsOptional()
  status?: LanguageFilter;

  @Swagger.ApiPropertyOptional({
    type: 'string',
    enum: ['code', 'name', 'status', 'secondary', 'isDiscovery'],
  })
  @IsOptional()
  field?: LanguageQuerySortFilter;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
