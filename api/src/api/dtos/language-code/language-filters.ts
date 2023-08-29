import { SortOrder } from '@app/common';
import * as Swagger from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { LanguageStatus } from 'src/core/models';
import {
  LanguageFilter,
  LanguageQuerySortFilter,
} from 'src/core/ports/language.repository';

export class FindAllLanguageParams {
  @Swagger.ApiProperty({
    type: 'string',
    enum: [LanguageStatus, 'PARTNER'],
  })
  @IsOptional()
  status?: LanguageFilter;

  @Swagger.ApiPropertyOptional({
    type: 'string',
    enum: ['code', 'name', 'status', 'secondary'],
  })
  @IsOptional()
  field?: LanguageQuerySortFilter;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
