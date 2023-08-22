import * as Swagger from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsTimeZone,
  IsDate,
  IsUrl,
} from 'class-validator';
import { LanguageResponse } from '../languages';
import { University } from 'src/core/models/university.model';
import {
  CreatePartnerUniversityCommand,
  CreateUniversityCommand,
  UpdateUniversityNameCommand,
} from 'src/core/usecases/university';
import { IsAfterThan } from 'src/api/validators';
import { CampusResponse } from '../campus';

export class CreateUniversityRequest implements CreateUniversityCommand {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

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

  @Swagger.ApiProperty({ type: 'string', isArray: true, example: ['FR'] })
  @IsString({ each: true })
  languages: string[];

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

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  resourcesUrl?: string;
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
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @IsTimeZone()
  timezone: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  resourcesUrl?: string;
}

export class UniversityResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Université de Lorraine' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  parent?: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @Expose({ groups: ['read'] })
  timezone: string;

  @Swagger.ApiProperty({ type: LanguageResponse, isArray: true })
  @Expose({ groups: ['read'] })
  languages: LanguageResponse[];

  @Swagger.ApiProperty({ type: CampusResponse, isArray: true })
  @Expose({ groups: ['read'] })
  sites: CampusResponse[];

  @Swagger.ApiProperty()
  @Expose({ groups: ['university:read'] })
  admissionStart: Date;

  @Swagger.ApiProperty()
  @Expose({ groups: ['university:read'] })
  admissionEnd: Date;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @Expose({ groups: ['university:read'] })
  website?: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @Expose({ groups: ['university:read'] })
  resourcesUrl?: string;

  constructor(partial: Partial<UniversityResponse>) {
    Object.assign(this, partial);
  }

  static fromUniversity(university: University) {
    return new UniversityResponse({
      id: university.id,
      name: university.name,
      parent: university.parent,
      timezone: university.timezone,
      languages: university.languages.map(LanguageResponse.fromLanguage),
      sites: university.campus.map(CampusResponse.fromCampus),
      admissionStart: university.admissionStart,
      admissionEnd: university.admissionEnd,
      website: university.website,
      resourcesUrl: university.resourcesUrl,
    });
  }
}
