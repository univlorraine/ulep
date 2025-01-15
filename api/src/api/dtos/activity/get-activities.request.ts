import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetActivitiesRequest extends PaginationDto {
  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  languagesCodes?: string[];

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  languageLevels?: string[];

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  themesIds?: string[];

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  searchTitle?: string;

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  shouldTakeOnlyMine?: boolean;
}
