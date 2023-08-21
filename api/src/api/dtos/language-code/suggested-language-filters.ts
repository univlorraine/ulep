import * as Swagger from '@nestjs/swagger';
import { SortOrder } from '@app/common';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';
import { SuggestedLanguageOrderKey } from 'src/core/ports/language.repository';

export class FindAllSuggestedLanguageParams extends PaginationDto {
  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  field?: SuggestedLanguageOrderKey;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
