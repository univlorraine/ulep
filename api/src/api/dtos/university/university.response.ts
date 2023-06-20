import { ApiProperty } from '@nestjs/swagger';
import { University } from 'src/core/models/university';
import { CountryResponse } from '../countries/country.response';

export class UniversityResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  timezone: string;

  @ApiProperty()
  country: CountryResponse;

  @ApiProperty()
  admissionStart: Date;

  @ApiProperty()
  admissionEnd: Date;

  static fromDomain(university: University): UniversityResponse {
    return {
      id: university.id,
      name: university.name,
      timezone: university.timezone,
      country: {
        id: university.country.id,
        code: university.country.code,
        name: university.country.name,
      },
      admissionStart: university.admissionStart,
      admissionEnd: university.admissionEnd,
    };
  }
}
