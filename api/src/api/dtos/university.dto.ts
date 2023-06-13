import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { CountryDto } from './country.dto';
import { University } from 'src/core/models/university';

// TODO: Add validation on dates (admissionStart < admissionEnd)
export class UniversityWrite {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  timezone: string;

  @IsString()
  @ApiProperty()
  countryCode: string;

  @IsDate()
  @ApiProperty()
  admissionStart: Date;

  @IsDate()
  @ApiProperty()
  admissionEnd: Date;
}

export class UniversityRead {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  timezone: string;

  @ApiProperty()
  country: CountryDto;

  @ApiProperty()
  admissionStart: Date;

  @ApiProperty()
  admissionEnd: Date;

  static fromDomain(university: University): UniversityRead {
    return {
      id: university.id,
      name: university.name,
      timezone: university.timezone,
      country: CountryDto.fromDomain(university.country),
      admissionStart: university.admissionStart,
      admissionEnd: university.admissionEnd,
    };
  }
}
