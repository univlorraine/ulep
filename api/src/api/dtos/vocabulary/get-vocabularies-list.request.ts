import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetVocabulariesListQuery extends PaginationDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  languageCode?: string;
}
