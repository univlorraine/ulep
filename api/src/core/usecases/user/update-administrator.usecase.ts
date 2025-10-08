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

import { KeycloakClient, KeycloakGroup } from '@app/keycloak';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';

export class UpdateAdministratorCommand {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  universityId?: string;
  languageId?: string;
  group?: KeycloakGroup;
  mimetype?: string;
  shouldRemoveAdminRole?: boolean;
}

@Injectable()
export class UpdateAdministratorUsecase {
  constructor(
    private readonly keycloakClient: KeycloakClient,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UpdateAdministratorCommand) {
    if (command.universityId) {
      const university = await this.universityRepository.ofId(
        command.universityId,
      );
      if (!university) {
        throw new RessourceDoesNotExist('University does not exist');
      }
    }
    const admin = await this.keycloakClient.getUserById(command.id);
    if (!admin) {
      throw new RessourceDoesNotExist('Administrator does not exist');
    }

    if (command.shouldRemoveAdminRole) {
      await this.keycloakClient.removeRealmRoleToUser(admin.id, 'admin');
    }

    try {
      const keycloakUser = await this.keycloakClient.updateUser({
        id: admin.id,
        newFirstName: command.firstname || admin.firstName,
        newLastName: command.lastname || admin.lastName,
        newEmail: command.email || admin.email,
        password: command.password,
        universityId: command.universityId || '',
        languageId: command.languageId || '',
        groups: !command.shouldRemoveAdminRole ? [command.group] : [],
      });
      return keycloakUser;
    } catch (error) {
      if (
        error.response.message.errorMessage ===
        'User exists with same username or email'
      ) {
        throw new BadRequestException('Email is already used');
      }
      throw error;
    }
  }
}
