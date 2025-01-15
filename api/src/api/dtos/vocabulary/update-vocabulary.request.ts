import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateVocabularyRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  word?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  translation?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  deletePronunciationWord?: boolean;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  deletePronunciationTranslation?: boolean;
}
