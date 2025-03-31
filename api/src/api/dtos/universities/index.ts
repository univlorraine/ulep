/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
