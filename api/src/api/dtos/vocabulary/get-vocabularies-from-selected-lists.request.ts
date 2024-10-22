import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsArray } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetVocabulariesFromSelectedListsQuery extends PaginationDto {
  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  vocabularySelectedListsId: string[];
}
