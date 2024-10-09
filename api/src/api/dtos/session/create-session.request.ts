import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSessionRequest {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  tandemId: string;

  @ApiProperty({ type: 'string', format: 'date' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startAt: Date;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  comment?: string;
}
