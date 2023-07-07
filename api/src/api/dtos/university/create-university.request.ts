import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsTimeZone } from 'class-validator';
import { IsAfterThan } from '../../validators/dates.validator';

// TODO: Add validation on dates (admissionStart < admissionEnd)
export class CreateUniversityRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsTimeZone()
  timezone: string;

  @ApiProperty()
  @IsString()
  countryCode: string;

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
