import * as Swagger from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsTimeZone,
  IsDate,
  IsUrl,
  IsArray,
} from 'class-validator';
import { University } from 'src/core/models/university.model';
import {
  CreatePartnerUniversityCommand,
  CreateUniversityCommand,
  UpdateUniversityNameCommand,
} from 'src/core/usecases/university';
import { IsAfterThan } from 'src/api/validators';
import { CampusResponse } from '../campus';
import { CountryResponse } from 'src/api/dtos/countries';

export class CreateUniversityRequest implements CreateUniversityCommand {
  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @IsArray()
  @IsOptional()
  codes?: string[];

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @IsArray()
  @IsOptional()
  domains?: string[];

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @IsString({ each: true })
  campusNames: string[];

  @Swagger.ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @IsTimeZone()
  timezone: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  admissionStart: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('admissionStart')
  admissionEnd: Date;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  website?: string;
}

export class UpdateUniversityNameRequest
  implements Omit<UpdateUniversityNameCommand, 'id'>
{
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateUniversityPartnerRequest
  implements Omit<CreatePartnerUniversityCommand, 'parent'>
{
  @Swagger.ApiProperty({ type: 'string', format: 'array' })
  @IsArray()
  @IsOptional()
  codes?: string[];

  @Swagger.ApiProperty({ type: 'string', format: 'array' })
  @IsArray()
  @IsOptional()
  domains?: string[];

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  admissionStart: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('admissionStart')
  admissionEnd: Date;

  @Swagger.ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @IsTimeZone()
  timezone: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  website?: string;
}

export class UniversityResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Université de Lorraine' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiProperty({ type: CountryResponse })
  @Expose({ groups: ['read'] })
  country: CountryResponse;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  parent?: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @Expose({ groups: ['read'] })
  timezone: string;

  @Swagger.ApiProperty({ type: CampusResponse, isArray: true })
  @Expose({ groups: ['read'] })
  sites: CampusResponse[];

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['read'] })
  codes: string[];

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['read'] })
  domains: string[];

  @Swagger.ApiProperty()
  @Expose({ groups: ['university:read'] })
  admissionStart: Date;

  @Swagger.ApiProperty()
  @Expose({ groups: ['university:read'] })
  admissionEnd: Date;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @Expose({ groups: ['university:read'] })
  website?: string;

  constructor(partial: Partial<UniversityResponse>) {
    Object.assign(this, partial);
  }

  static fromUniversity(university: University) {
    return new UniversityResponse({
      id: university.id,
      name: university.name,
      country: CountryResponse.fromDomain(university.country),
      parent: university.parent,
      timezone: university.timezone,
      sites: university.campus.map(CampusResponse.fromCampus),
      codes: university.codes,
      domains: university.domains,
      admissionStart: university.admissionStart,
      admissionEnd: university.admissionEnd,
      website: university.website,
    });
  }
}
