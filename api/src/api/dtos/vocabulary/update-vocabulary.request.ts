import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateVocabularyRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  word?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  translation?: string;
}
