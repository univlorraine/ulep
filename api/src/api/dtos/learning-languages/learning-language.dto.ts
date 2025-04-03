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

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  JOKER_LANGUAGE_CODE,
  LearningType,
  MediaObject,
  ProficiencyLevel,
} from 'src/core/models';

export class LearningLanguageDto {
  @ApiProperty({ type: 'string', example: 'EN' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code: string;

  @ApiProperty({ enum: ProficiencyLevel, example: 'B2' })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;

  @ApiProperty({ enum: LearningType })
  @IsEnum(LearningType)
  learningType: LearningType;

  @ApiProperty()
  @IsBoolean()
  sameGender: boolean;

  @ApiProperty()
  @IsBoolean()
  sameAge: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  sameTandem: boolean;

  @ApiProperty({ type: 'string' })
  @IsUUID()
  @IsOptional()
  campusId?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  certificateOption?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  learningJournal?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  consultingInterview?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  sharedCertificate?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  certificateFile?: MediaObject;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  specificProgram?: boolean;

  constructor(partial: Partial<LearningLanguageDto>) {
    Object.assign(this, partial, {
      code: partial?.code || JOKER_LANGUAGE_CODE,
    });
  }
}
