import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetActivitiesRequest extends PaginationDto {
  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  languagesCodes?: string[];

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  languageLevels?: string[];

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  themesIds?: string[];

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  searchTitle?: string;

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  shouldTakeOnlyMine?: boolean;
}
