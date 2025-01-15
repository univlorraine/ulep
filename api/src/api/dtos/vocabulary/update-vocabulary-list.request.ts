import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateVocabularyListRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  symbol?: string;

  @ApiPropertyOptional({ type: 'string' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  profileIds?: string[];

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  wordLanguageCode?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  translationLanguageCode?: string;
}
