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
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateProfileCommand } from 'src/core/usecases/profiles/create-profile.usecase';
import { BiographyDto } from './biography';
import { LearningLanguageDto } from '../learning-languages';
import { AvailabilitesDto } from 'src/api/dtos/profiles/availabilities';
import { MeetingFrequency } from 'src/core/models';

export class CreateProfileRequest
  implements Omit<CreateProfileCommand, 'user'>
{
  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsNotEmpty()
  nativeLanguageCode: string;

  @Swagger.ApiProperty({ type: () => [LearningLanguageDto] })
  @IsArray()
  @Transform(({ value }) => value.map((val) => new LearningLanguageDto(val)))
  @ValidateNested()
  learningLanguages: LearningLanguageDto[];

  @ApiPropertyOptional({ type: 'string', example: ['FR'] })
  @IsNotEmpty({ each: true })
  @IsOptional()
  masteredLanguageCodes?: string[];

  @Swagger.ApiProperty({ type: 'string', isArray: true, format: 'uuid' })
  @IsUUID('4', { each: true })
  objectives: string[];

  @Swagger.ApiProperty({ type: 'string', enum: MeetingFrequency })
  @IsNotEmpty()
  @IsEnum(MeetingFrequency)
  meetingFrequency: MeetingFrequency;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @ArrayMaxSize(10)
  @ArrayMinSize(5)
  @IsNotEmpty({ each: true })
  interests: string[];

  @Swagger.ApiProperty({ type: () => AvailabilitesDto })
  @Transform(({ value }) => new AvailabilitesDto(value))
  @IsObject()
  @ValidateNested()
  availabilities: AvailabilitesDto;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  availabilitiesNote?: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  availabilitiesNotePrivacy?: boolean;

  @Swagger.ApiProperty({ type: () => BiographyDto })
  @Transform(({ value }) => new BiographyDto(value))
  @IsObject()
  @ValidateNested()
  biography: BiographyDto;
}
