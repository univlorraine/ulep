import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class GetLearningLanguageMatchsRequest {
  @ApiPropertyOptional({ minimum: 1, default: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly count?: number;

  @ApiProperty({ type: 'string', isArray: true })
  @IsUUID('4', { each: true })
  universityIds: string[];
}
