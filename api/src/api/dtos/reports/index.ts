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
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  TextContentResponse,
  textContentTranslationResponse,
} from 'src/api/dtos/text-content';
import { UserResponse } from 'src/api/dtos/users';
import { Translation } from 'src/core/models';
import {
  Report,
  ReportCategory,
  ReportStatus,
} from 'src/core/models/report.model';
import {
  CreateReportCommand,
  UpdateReportStatusCommand,
} from 'src/core/usecases/report';

export class CreateReportCategoryRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class UpdateReportCategoryRequest {
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

export class CreateReportRequest implements Omit<CreateReportCommand, 'owner'> {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  category: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateReportMessageRequest
  implements Omit<CreateReportCommand, 'owner' | 'category'>
{
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  filePath?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  mediaType?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  reportedUserId: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsUUID()
  tandemId?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsUUID()
  messageId?: string;

  @Swagger.ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  isMessageDeleted?: boolean;
}

export class UpdateReportStatusRequest
  implements Omit<UpdateReportStatusCommand, 'id'>
{
  @Swagger.ApiProperty({ type: 'string', enum: ReportStatus })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  comment: string;

  @Swagger.ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  shouldDeleteMessage?: boolean;
}

export class ReportCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<ReportCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    entity: ReportCategory,
    languageCode?: string,
  ): ReportCategoryResponse {
    const name = textContentTranslationResponse({
      textContent: entity.name,
      languageCode,
    });

    return new ReportCategoryResponse({
      id: entity.id,
      name: name,
    });
  }
}

export class GetReportCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: () => TextContentResponse })
  @Expose({ groups: ['read'] })
  name: TextContentResponse;

  constructor(partial: Partial<GetReportCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(entity: ReportCategory): GetReportCategoryResponse {
    return new GetReportCategoryResponse({
      id: entity.id,
      name: TextContentResponse.fromDomain(entity.name),
    });
  }
}

class ReportMetadataResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  filePath: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  mediaType: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  tandemUserName: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  tandemLanguage: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  messageId: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  isMessageDeleted: boolean;

  constructor(partial: Partial<ReportMetadataResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: any): ReportMetadataResponse {
    return new ReportMetadataResponse({
      filePath: instance.filePath,
      mediaType: instance.mediaType,
      tandemUserName: instance.tandemUserName,
      tandemLanguage: instance.tandemLanguage,
      messageId: instance.messageId,
      isMessageDeleted: instance.isMessageDeleted,
    });
  }
}

export class ReportResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  category: ReportCategoryResponse;

  @Swagger.ApiProperty({ type: 'string', enum: ReportStatus })
  @Expose({ groups: ['read'] })
  status: ReportStatus;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiPropertyOptional({ type: () => UserResponse })
  @Expose({ groups: ['read'] })
  user?: UserResponse;

  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  comment?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  metadata?: ReportMetadataResponse;

  constructor(partial: Partial<ReportResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Report, languageCode?: string): ReportResponse {
    return new ReportResponse({
      id: instance.id,
      category: ReportCategoryResponse.fromDomain(
        instance.category,
        languageCode,
      ),
      status: instance.status,
      content: instance.content,
      user: instance.user ? UserResponse.fromDomain(instance.user) : undefined,
      createdAt: instance.createdAt,
      comment: instance.comment,
      metadata: instance.metadata
        ? ReportMetadataResponse.fromDomain(instance.metadata)
        : undefined,
    });
  }
}
