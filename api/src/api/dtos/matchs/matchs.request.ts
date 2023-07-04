import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetMatchsRequest {
  @ApiPropertyOptional({ minimum: 1, default: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly count?: number;
}
