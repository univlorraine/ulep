import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class GetLearningLanguageMatchsRequest {
  @ApiPropertyOptional({ default: 5 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly count?: number;

  @ApiProperty({ type: 'string', isArray: true })
  @IsOptional()
  @IsUUID('4', { each: true })
  universityIds: string[];
}
