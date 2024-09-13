import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetVocabulariesFromSelectedListsQuery extends PaginationDto {
  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsNotEmpty()
  @IsArray()
  vocabularySelectedListsId: string[];
}
