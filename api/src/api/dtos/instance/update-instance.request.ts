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

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EditoMandatoryTranslations } from 'src/core/models/Instance.model';

export class UpdateInstanceRequest {
  @ApiPropertyOptional({ type: 'string', example: 'Université de Lorraine' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsOptional()
  @IsUrl()
  cguUrl?: string;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsOptional()
  @IsUrl()
  confidentialityUrl?: string;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsOptional()
  @IsUrl()
  ressourceUrl?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  primaryColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  primaryBackgroundColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  primaryDarkColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  secondaryColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  secondaryBackgroundColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  secondaryDarkColor?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @Type(() => Boolean)
  isInMaintenance?: boolean;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  // Sent as a multipart string ("true"/"false") from the config form, so we
  // cannot rely on Boolean() (Boolean("false") === true). Parse explicitly.
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  allowStaffStudentMatching?: boolean;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  daysBeforeClosureNotification?: number;

  @ApiPropertyOptional({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  @IsArray()
  editoMandatoryTranslations?: EditoMandatoryTranslations[];

  @ApiPropertyOptional({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  @IsArray()
  editoCentralUniversityTranslations?: string[];

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsOptional()
  // Sent as a multipart string: an emptied field arrives as '' and must clear
  // the value (null) instead of failing the url validation.
  @Transform(({ value }) => (value === '' ? null : value))
  @IsUrl()
  titleFontUrl?: string | null;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  titleFontFamily?: string | null;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsUrl()
  bodyFontUrl?: string | null;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  bodyFontFamily?: string | null;
}
