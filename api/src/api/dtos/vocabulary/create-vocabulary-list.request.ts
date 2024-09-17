import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateVocabularyListRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  symbol: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  profileId: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  wordLanguageCode: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  translationLanguageCode: string;
}
