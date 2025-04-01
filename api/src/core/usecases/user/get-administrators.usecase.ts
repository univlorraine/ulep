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

import { KeycloakClient, KeycloakUser } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import {
  AdministratorsQuery,
  UserRepresentationWithAvatar,
} from 'src/api/dtos';
import { AdminRole } from 'src/core/models';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';

@Injectable()
export class GetAdministratorsUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(
    user?: KeycloakUser,
    query?: AdministratorsQuery,
  ): Promise<UserRepresentationWithAvatar[]> {
    const result = await this.keycloak.getAdministrators();

    const administrators = await Promise.all(
      result.map(
        async (administrator) =>
          ({
            ...administrator,
            groups: await this.keycloak.getUserGroups(administrator.id),
            image: await this.mediaObjectRepository.findOne(administrator.id),
            language: administrator.attributes?.languageId?.[0]
              ? await this.languageRepository.ofId(
                  administrator.attributes?.languageId?.[0],
                )
              : undefined,
          } as UserRepresentationWithAvatar),
      ),
    );

    if (query) {
      return this.filterByQuery(administrators, query);
    }

    if (user.realm_access.roles.includes(AdminRole.SUPER_ADMIN)) {
      return administrators;
    }

    return this.filterByUniversity(administrators, user.universityId);
  }

  filterByQuery(
    administrators: UserRepresentationWithAvatar[],
    query: AdministratorsQuery,
  ) {
    let filteredAdministrators = [...administrators];

    if (query?.universityId) {
      filteredAdministrators = this.filterByUniversity(
        filteredAdministrators,
        query.universityId,
      );
    }

    if (query?.lastname) {
      filteredAdministrators = filteredAdministrators.filter((administrator) =>
        administrator.lastName
          .toLowerCase()
          .includes(query.lastname.toLowerCase()),
      );
    }

    if (query?.firstname) {
      filteredAdministrators = filteredAdministrators.filter((administrator) =>
        administrator.firstName
          .toLowerCase()
          .includes(query.firstname.toLowerCase()),
      );
    }

    if (query?.email) {
      filteredAdministrators = filteredAdministrators.filter((administrator) =>
        administrator.email.toLowerCase().includes(query.email.toLowerCase()),
      );
    }

    if (query?.groupId) {
      filteredAdministrators = filteredAdministrators.filter(
        (administrator) => administrator.groups[0].id === query.groupId,
      );
    }

    return filteredAdministrators;
  }

  filterByUniversity(
    administrators: UserRepresentationWithAvatar[],
    universityId: string,
  ) {
    return administrators.filter(
      (administrator) =>
        administrator.attributes?.universityId?.[0] === universityId,
    );
  }
}
