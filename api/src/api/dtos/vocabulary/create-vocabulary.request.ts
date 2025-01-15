import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVocabularyRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  vocabularyListId: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  word: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  translation?: string;
}
