import * as Swagger from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsTimeZone,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { AdministratorResponse, MediaObjectResponse } from 'src/api/dtos';
import { CountryResponse } from 'src/api/dtos/countries';
import { LanguageResponse } from 'src/api/dtos/languages';
import { IsAfterThan } from 'src/api/validators';
import { Instance } from 'src/core/models/Instance.model';
import { PairingMode, University } from 'src/core/models/university.model';
import {
  CreatePartnerUniversityCommand,
  CreateUniversityCommand,
  UpdateUniversityCommand,
} from 'src/core/usecases/university';
import { CampusResponse } from '../campus';

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

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  openServiceDate: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('openServiceDate')
  closeServiceDate: Date;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @Swagger.ApiProperty({ type: 'string', enum: PairingMode })
  @IsString()
  @IsNotEmpty()
  pairingMode: PairingMode;

  @Swagger.ApiProperty({ type: 'number', minimum: 1, maximum: 3 })
  @Type(() => Number)
  @Min(1)
  @Max(3)
  maxTandemsPerUser: number;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsOptional()
  @IsEmail()
  notificationEmail?: string;

  @Swagger.ApiProperty({ type: 'string', format: 'array' })
  @IsArray()
  @IsOptional()
  specificLanguagesAvailableIds: string[];

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  nativeLanguageId: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'uuid' })
  @IsString()
  @IsOptional()
  defaultCertificateFileId?: string;
}

export class UpdateUniversityRequest
  implements Omit<UpdateUniversityCommand, 'id'>
{
  @Swagger.ApiProperty({ type: 'string', format: 'array' })
  @IsArray()
  @IsOptional()
  codes: string[];

  @Swagger.ApiProperty({ type: 'string', format: 'array' })
  @IsArray()
  @IsOptional()
  domains: string[];

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
  @IsAfterThan('openServiceDate')
  admissionStart: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('admissionStart')
  admissionEnd: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  openServiceDate: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('openServiceDate')
  @IsAfterThan('admissionEnd')
  closeServiceDate: Date;

  @Swagger.ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @IsTimeZone()
  timezone: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  website: string;

  @Swagger.ApiProperty({ type: 'string', enum: PairingMode })
  @IsString()
  @IsNotEmpty()
  pairingMode: PairingMode;

  @Swagger.ApiProperty({ type: 'number', minimum: 1, maximum: 3 })
  @Type(() => Number)
  @Min(1)
  @Max(3)
  maxTandemsPerUser: number;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsEmail()
  @IsOptional()
  notificationEmail?: string;

  @Swagger.ApiProperty({ type: 'string', format: 'array' })
  @IsArray()
  @IsOptional()
  specificLanguagesAvailableIds: string[];

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  nativeLanguageId: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  defaultContactId: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsString()
  @IsOptional()
  defaultCertificateFileId?: string;
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

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  openServiceDate: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('openServiceDate')
  closeServiceDate: Date;

  @Swagger.ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @IsTimeZone()
  timezone: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @Swagger.ApiProperty({ type: 'string', enum: PairingMode })
  @IsString()
  @IsNotEmpty()
  pairingMode: PairingMode;

  @Swagger.ApiProperty({ type: 'number', minimum: 1, maximum: 3 })
  @Type(() => Number)
  @Min(1)
  @Max(3)
  maxTandemsPerUser: number;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsEmail()
  @IsOptional()
  notificationEmail?: string;

  @Swagger.ApiProperty({ type: 'string', format: 'array' })
  @IsArray()
  @IsOptional()
  specificLanguagesAvailableIds: string[];

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  nativeLanguageId: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'uuid' })
  @IsString()
  @IsOptional()
  defaultCertificateFileId?: string;
}

export class UniversityResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Université de Lorraine' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiProperty({ type: () => CountryResponse })
  @Expose({ groups: ['university:read'] })
  country: CountryResponse;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  parent?: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @Expose({ groups: ['read'] })
  timezone: string;

  @Swagger.ApiProperty({ type: () => CampusResponse, isArray: true })
  @Expose({ groups: ['read'] })
  sites: CampusResponse[];

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  admissionStart: Date;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  admissionEnd: Date;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  openServiceDate: Date;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  closeServiceDate: Date;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  hasCode: boolean;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  isCodeMandatory?: boolean;

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['university:read'] })
  codes: string[];

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['university:read'] })
  domains: string[];

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @Expose({ groups: ['university:read', 'read'] })
  website?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @Expose({ groups: ['university:read'] })
  defaultContactId?: string;

  @Swagger.ApiPropertyOptional({ type: () => AdministratorResponse })
  @Expose({ groups: ['university:read'] })
  defaultContact?: AdministratorResponse;

  @Swagger.ApiProperty({ type: 'string', enum: PairingMode })
  @Expose({ groups: ['read'] })
  pairingMode: PairingMode;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  maxTandemsPerUser: number;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @Expose({ groups: ['read'] })
  notificationEmail?: string;

  @Swagger.ApiProperty({ type: () => LanguageResponse, isArray: true })
  @Expose({ groups: ['read'] })
  specificLanguagesAvailable: LanguageResponse[];

  @Swagger.ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  nativeLanguage: LanguageResponse;

  @Swagger.ApiPropertyOptional({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  logo?: MediaObjectResponse;

  @Swagger.ApiPropertyOptional({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  defaultCertificateFile?: MediaObjectResponse;

  @Swagger.ApiPropertyOptional({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  exampleDefaultCertificateFile?: MediaObjectResponse;

  constructor(partial: Partial<UniversityResponse>) {
    Object.assign(this, partial);
  }

  static fromUniversity(university: University, instance?: Instance) {
    return new UniversityResponse({
      id: university.id,
      logo: university.logo
        ? MediaObjectResponse.fromMediaObject(university.logo)
        : undefined,
      name: university.name,
      country: CountryResponse.fromDomain(university.country),
      parent: university.parent,
      timezone: university.timezone,
      sites: university.campus.map(CampusResponse.fromCampus),
      hasCode: !!(university.codes?.length > 0),
      codes: university.codes,
      domains: university.domains,
      admissionStart: university.admissionStart,
      admissionEnd: university.admissionEnd,
      openServiceDate: university.openServiceDate,
      isCodeMandatory:
        university.domains?.length === 0 && university.codes?.length > 0,
      closeServiceDate: university.closeServiceDate,
      website: university.website,
      pairingMode: university.pairingMode,
      maxTandemsPerUser: university.maxTandemsPerUser,
      notificationEmail: university.notificationEmail,
      specificLanguagesAvailable: university.specificLanguagesAvailable?.map(
        LanguageResponse.fromLanguage,
      ),
      nativeLanguage: LanguageResponse.fromLanguage(university.nativeLanguage),
      defaultContactId: university.defaultContactId,
      defaultCertificateFile: university.defaultCertificateFile
        ? MediaObjectResponse.fromMediaObject(university.defaultCertificateFile)
        : undefined,
      exampleDefaultCertificateFile: instance?.defaultCertificateFile
        ? MediaObjectResponse.fromMediaObject(instance.defaultCertificateFile)
        : undefined,
    });
  }
}
