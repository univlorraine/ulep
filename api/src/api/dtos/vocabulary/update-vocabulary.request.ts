import { ApiPropertyOptional } from '@nestjs/swagger';
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
  deletePronunciationWord?: boolean;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  deletePronunciationTranslation?: boolean;
}
