import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '@app/common';

import { PaginationDto } from '../pagination';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { LearningLanguageQuerySortKey } from 'src/core/ports/learning-language.repository';
import { Transform } from 'class-transformer';

export class GetLearningLanguagesRequest extends PaginationDto {
  @ApiProperty({ type: 'string', isArray: true })
  @IsUUID('4', { each: true })
  universityIds: string[];

  @ApiProperty({ type: 'boolean' })
  @Transform(({ value }) => (value ? value === 'true' : undefined))
  @IsBoolean()
  @IsOptional()
  hasActiveTandem?: boolean;

  @ApiProperty({ type: 'boolean' })
  @Transform(({ value }) => (value ? value === 'true' : undefined))
  @IsBoolean()
  @IsOptional()
  hasActionableTandem?: boolean;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({
    type: 'string',
    enum: LearningLanguageQuerySortKey,
  })
  @IsOptional()
  field?: LearningLanguageQuerySortKey;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
