import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSessionRequest {
  @ApiPropertyOptional({ type: 'string' })
  @IsNotEmpty()
  startAt: Date;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  comment?: string;
}
