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
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MediaObjectResponse } from 'src/api/dtos/medias';
import {
  TextContentResponse,
  textContentTranslationResponse,
} from 'src/api/dtos/text-content';
import { LearningObjective, Translation } from 'src/core/models';
import { CustomLearningGoal } from 'src/core/models/custom-learning-goal.model';

export class CreateObjectiveRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class UpdateObjectiveRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class GetObjectiveResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiPropertyOptional({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  image?: MediaObjectResponse;

  @Swagger.ApiProperty({ type: () => TextContentResponse })
  @Expose({ groups: ['read'] })
  name: TextContentResponse;

  constructor(partial: Partial<GetObjectiveResponse>) {
    Object.assign(this, partial);
  }
  static fromDomain(instance: LearningObjective) {
    return new GetObjectiveResponse({
      id: instance.id,
      image: instance.image
        ? MediaObjectResponse.fromMediaObject(instance.image)
        : null,
      name: TextContentResponse.fromDomain(instance.name),
    });
  }
}

export class ObjectiveResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiPropertyOptional({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  image?: MediaObjectResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<ObjectiveResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: LearningObjective, languageCode?: string) {
    const name = textContentTranslationResponse({
      textContent: instance.name,
      languageCode,
    });

    return new ObjectiveResponse({
      id: instance.id,
      image: instance.image
        ? MediaObjectResponse.fromMediaObject(instance.image)
        : null,
      name,
    });
  }
}

export class CustomLearningGoalResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  description: string;

  constructor(partial: Partial<CustomLearningGoalResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: CustomLearningGoal) {
    return new CustomLearningGoalResponse({
      id: instance.id,
      title: instance.title,
      description: instance.description,
    });
  }
}

export class CreateCustomLearningGoalRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  description?: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsString()
  @IsNotEmpty()
  learningLanguageId: string;
}

export class UpdateCustomLearningGoalRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  description?: string;
}
