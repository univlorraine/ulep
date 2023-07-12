import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsTimeZone } from 'class-validator';
import { IsAfterThan } from '../../validators/dates.validator';

// TODO: Add validation on dates (admissionStart < admissionEnd)
export class CreateUniversityRequest {
  @ApiProperty({
    type: 'string',
    example: 'France',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'IANA Time Zone',
    example: 'Europe/Paris',
  })
  @IsTimeZone()
  timezone: string;

  @ApiProperty({
    type: 'string',
    description: 'ISO 3166-1 code',
    example: 'FR',
  })
  @IsString()
  countryCode: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  admissionStart: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('admissionStart')
  admissionEnd: Date;
}
