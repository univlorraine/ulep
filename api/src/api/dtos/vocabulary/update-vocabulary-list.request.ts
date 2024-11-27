import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateVocabularyListRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  symbol?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  profileIds?: string[];

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  wordLanguageCode?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  translationLanguageCode?: string;
}
