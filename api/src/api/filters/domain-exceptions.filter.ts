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

import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { DomainError, DomainErrorCode } from 'src/core/errors';

export const domainErrorToHttpStatusCode: Record<DomainErrorCode, HttpStatus> =
  {
    [DomainErrorCode.RESSOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [DomainErrorCode.RESSOURCE_ALREADY_EXIST]: HttpStatus.CONFLICT,
    [DomainErrorCode.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
    [DomainErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  };

@Catch(DomainError)
export class DomainErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger();

  // This filter catches unhandled domain exceptions and returns a predefined
  // well-formatted JSON response with a human-readable error and a semantically
  // correct HTTP status code that can be handled programmatically by the client.
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpStatusCode = domainErrorToHttpStatusCode[exception.code];

    response.status(httpStatusCode).json({
      statusCode: httpStatusCode,
      message: exception.message,
      code: exception.code,
    });
  }
}
