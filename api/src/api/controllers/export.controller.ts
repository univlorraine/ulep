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

import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Response } from 'express';
import { GetProfilesUsecase } from 'src/core/usecases/profiles/get-profiles.usecase';
import { Role, Roles } from '../decorators/roles.decorator';
import { AuthenticationGuard } from '../guards';

@Controller('export')
@Swagger.ApiExcludeController()
export class ExportController {
  constructor(private readonly getProfilesUsecase: GetProfilesUsecase) {}

  @Get('profiles')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  async profiles(@Res() response: Response): Promise<any> {
    const data = await this.getProfilesUsecase.execute({
      page: 1,
      limit: 1500,
    });

    const rows: any[] = [];
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      const row = {
        id: i + 1,
        firstname: item.user.firstname,
        lastname: item.user.lastname,
        university: item.user.university.name,
        age: item.user.age,
        gender: item.user.gender,
        role: item.user.role,
        native_language: item.nativeLanguage.code,
        learning_language: item.learningLanguages?.[0]?.language.code,
        level: item.learningLanguages?.[0]?.level,
        // goal: item.preferences.goals.map((g) => g.name.content).join(', '),
        interests: item.interests.map((i) => i.name.content).join(', '),
        meeting_frequency: item.meetingFrequency,
      };

      rows.push(row);
    }

    const csvData = this.jsonToCsv(rows);

    response.header('Content-Type', 'text/csv');
    response.attachment('profiles.csv');
    response.send(csvData);
  }

  private jsonToCsv(jsonData: any[]): string {
    if (jsonData.length === 0) return '';

    const headers = Object.keys(jsonData[0]).join(';');

    const data = jsonData.map((row) => Object.values(row).join(';')).join('\n');

    const csvData = `${headers}\n${data}`;

    return csvData;
  }
}
