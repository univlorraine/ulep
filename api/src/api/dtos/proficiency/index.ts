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
import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import {
  TextContentResponse,
  textContentTranslationResponse,
} from 'src/api/dtos/text-content';
import { Translation } from 'src/core/models';
import {
  ProficiencyLevel,
  ProficiencyQuestion,
  ProficiencyTest,
} from 'src/core/models/proficiency.model';
import { CreateTestCommand } from 'src/core/usecases/proficiency';

export class CreateTestRequest implements CreateTestCommand {
  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;
}

export class CreateQuestionRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsNotEmpty()
  level: ProficiencyLevel;

  @Swagger.ApiProperty({ type: 'string', uniqueItems: true })
  @IsString()
  @IsNotEmpty()
  value: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];

  @Swagger.ApiPropertyOptional({ type: 'boolean' })
  @Transform(({ value }) => value ?? true)
  @IsBoolean()
  answer = true;
}

export class UpdateQuestionRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @IsNotEmpty()
  level: ProficiencyLevel;

  @Swagger.ApiProperty({ type: 'string', uniqueItems: true })
  @IsString()
  @IsNotEmpty()
  value: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];

  @Swagger.ApiPropertyOptional({ type: 'boolean' })
  @Transform(({ value }) => value ?? true)
  @IsBoolean()
  answer = true;
}

export class GetProficiencyQuestionResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', uniqueItems: true })
  @Expose({ groups: ['read'] })
  value: TextContentResponse;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  answer: boolean;

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @Expose({ groups: ['read'] })
  level: ProficiencyLevel;

  constructor(partial: Partial<GetProficiencyQuestionResponse>) {
    Object.assign(this, partial);
  }

  static fromProficiencyQuestion(
    question: ProficiencyQuestion,
  ): GetProficiencyQuestionResponse {
    return new GetProficiencyQuestionResponse({
      id: question.id,
      value: TextContentResponse.fromDomain(question.text),
      answer: question.answer,
      level: question.level,
    });
  }
}

export class ProficiencyQuestionResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', uniqueItems: true })
  @Expose({ groups: ['read'] })
  value: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  answer: boolean;

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @Expose({ groups: ['read'] })
  level: ProficiencyLevel;

  constructor(partial: Partial<ProficiencyQuestionResponse>) {
    Object.assign(this, partial);
  }

  static fromProficiencyQuestion(
    question: ProficiencyQuestion,
    languageCode?: string,
  ): ProficiencyQuestionResponse {
    const name = textContentTranslationResponse({
      textContent: question.text,
      languageCode,
    });

    return new ProficiencyQuestionResponse({
      id: question.id,
      value: name,
      answer: question.answer,
      level: question.level,
    });
  }
}

export class ProficiencyTestResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @Expose({ groups: ['read'] })
  level: ProficiencyLevel;

  @Swagger.ApiProperty({
    type: () => ProficiencyQuestionResponse,
    isArray: true,
  })
  @Expose({ groups: ['test:read'] })
  questions: ProficiencyQuestionResponse[];

  constructor(partial: Partial<ProficiencyTestResponse>) {
    Object.assign(this, partial);
  }

  static fromProficiencyTest(
    test: ProficiencyTest,
    languageCode?: string,
  ): ProficiencyTestResponse {
    return new ProficiencyTestResponse({
      id: test.id,
      level: test.level,
      questions: (test.questions ?? []).map((question) =>
        ProficiencyQuestionResponse.fromProficiencyQuestion(
          question,
          languageCode,
        ),
      ),
    });
  }
}
