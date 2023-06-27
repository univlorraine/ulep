import { ApiProperty } from '@nestjs/swagger';
import { University } from '../../../core/models/university';
import { CountryResponse } from '../countries/country.response';
import { Expose, Transform } from 'class-transformer';

export class UniversityResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  name: string;

  @ApiProperty()
  @Expose({ groups: ['university:read'] })
  timezone: string;

  @ApiProperty()
  @Expose({ groups: ['university:read'] })
  @Transform(({ value }) => new CountryResponse(value))
  country: CountryResponse;

  @ApiProperty()
  @Expose({ groups: ['university:read'] })
  admissionStart: Date;

  @ApiProperty()
  @Expose({ groups: ['university:read'] })
  admissionEnd: Date;

  constructor(partial: Partial<UniversityResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(university: University): UniversityResponse {
    return new UniversityResponse({
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
    });
  }
}
