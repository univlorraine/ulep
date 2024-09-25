import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination';
import { LearningType } from 'src/core/models';

export class ProfileWithTandemsQueryFilter extends PaginationDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  university?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  learningLanguage?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  division?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  learningType?: LearningType;
}
