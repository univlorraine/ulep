import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetVocabulariesFromListQuery extends PaginationDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  search?: string;
}
