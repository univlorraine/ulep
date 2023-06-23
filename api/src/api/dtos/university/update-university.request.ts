import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { IsAfterThan } from '../../validators/dates.validator';

export class UpdateUniversityRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  admissionStart: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('admissionStart')
  admissionEnd: Date;
}
