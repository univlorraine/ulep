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

import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActivityStatus } from 'src/core/models/activity.model';
import {
  ActivityPagination,
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';

interface GetActivitiesCommand {
  pagination: ActivityPagination;
  userId: string;
  searchTitle?: string;
  languageCode?: string;
  languageLevel?: string;
  category?: string;
  theme?: string;
  status?: ActivityStatus;
  university?: string;
}

@Injectable()
export class GetAllActivitiesByAdminUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: GetActivitiesCommand) {
    const user = await this.getUserUniversityId(command.userId);
    console.log('Before get', command);
    const activities = await this.activityRepository.allWithThemeWithCategory({
      searchTitle: command.searchTitle,
      pagination: command.pagination,
      languageCode: command.languageCode,
      languageLevel: command.languageLevel,
      category: command.category,
      theme: command.theme,
      status: command.status
        ? [command.status]
        : [
            ActivityStatus.PUBLISHED,
            ActivityStatus.IN_VALIDATION,
            ActivityStatus.REJECTED,
            ActivityStatus.DRAFT,
          ],
      university: command.university,
      currentUserUniversityId: user.attributes['universityId']?.[0],
    });
    console.log('After get');

    return activities;
  }

  private async getUserUniversityId(userId: string) {
    const user = await this.keycloakClient.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
