import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsTimeZone,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { IsAfterThan } from '../../validators/dates.validator';
import { CreateUniversityCommand } from 'src/core/usecases/universities/create-university.usecase';
import { Language } from 'src/core/models/language';
import { University } from 'src/core/models/university';

export class CreateUniversityRequest implements CreateUniversityCommand {
  @ApiProperty({ type: 'string', example: 'France' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  parent?: string;

  @ApiProperty({ type: 'string', isArray: true })
  @IsString({ each: true })
  campus: string[];

  @ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @IsTimeZone()
  timezone: string;

  @ApiProperty({ type: 'string', isArray: true, example: ['FR'] })
  @IsString({ each: true })
  languageCodes: string[];

  @ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  admissionStart: Date;

  @ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('admissionStart')
  admissionEnd: Date;
}

export class UniversityResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty({ type: 'string', example: 'Université de Lorraine' })
  @Expose({ groups: ['read'] })
  name: string;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @Expose({ groups: ['read'] })
  website?: string;

  @ApiPropertyOptional({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  parent?: string;

  @ApiProperty({ type: 'string', example: 'Europe/Paris' })
  @Expose({ groups: ['read'] })
  timezone: string;

  @ApiProperty({ type: 'string', isArray: true, example: ['FR'] })
  @Expose({ groups: ['read'] })
  languages: string[];

  @ApiProperty({ type: 'string', isArray: true, example: ['Metz', 'Nancy'] })
  @Expose({ groups: ['read'] })
  campus: string[];

  @ApiProperty()
  @Expose({ groups: ['university:read'] })
  admissionStart: Date;

  @ApiProperty()
  @Expose({ groups: ['university:read'] })
  admissionEnd: Date;

  constructor(partial: Partial<UniversityResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(domain: University): UniversityResponse {
    return new UniversityResponse({
      id: domain.id,
      name: domain.name,
      website: domain.website,
      parent: domain.parent,
      timezone: domain.timezone,
      languages: domain.languages.map((language: Language) => language.code),
      campus: domain.campus,
      admissionStart: domain.admissionStart,
      admissionEnd: domain.admissionEnd,
    });
  }
}
