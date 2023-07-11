import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class GetMatchsRequest {
  @ApiProperty({ description: 'The profile id' })
  @IsUUID()
  readonly id: string;

  @ApiPropertyOptional({ minimum: 1, default: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly count?: number;
}
