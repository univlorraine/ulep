import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateVocabularyListRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  symbol?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  profileIds?: string[];
}
