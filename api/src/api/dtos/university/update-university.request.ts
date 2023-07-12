import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsAfterThan } from '../../validators/dates.validator';

export class UpdateUniversityRequest {
  @ApiPropertyOptional({
    type: 'string',
    example: 'France',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  admissionStart: Date;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('admissionStart')
  @IsOptional()
  admissionEnd: Date;
}
