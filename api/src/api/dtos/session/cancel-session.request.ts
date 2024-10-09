import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CancelSessionRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  comment?: string;
}
