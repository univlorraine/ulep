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

import {
  KeycloakClient,
  KeycloakGroup,
  KeycloakRealmRoles,
} from '@app/keycloak';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import { University } from 'src/core/models';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class CreateAdministratorCommand {
  email: string;
  firstname: string;
  lastname: string;
  universityId: string;
  languageId?: string;
  group: KeycloakGroup;
}

@Injectable()
export class CreateAdministratorUsecase {
  constructor(
    private readonly env: ConfigService<Env, true>,
    private readonly keycloakClient: KeycloakClient,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: CreateAdministratorCommand) {
    const university = await this.getUniversity(command.universityId);

    let user = await this.keycloakClient.getUserByEmail(command.email);

    if (!user) {
      // The realmRoles property to assign a role on user creation does not work
      // See the current issue : https://github.com/keycloak/keycloak/issues/13390
      user = await this.keycloakClient.createAdministrator({
        email: command.email,
        firstname: command.firstname,
        lastname: command.lastname,
        universityId: command.universityId,
        languageId: command.languageId,
        groups: [command.group.name],
      });

      await this.keycloakClient.addRealmRoleToUser(
        user.id,
        KeycloakRealmRoles.ADMIN,
      );
    } else {
      const isAdministator = await this.isAdministator(user.id);
      if (isAdministator) {
        throw new BadRequestException('User is already an administrator');
      }

      await this.keycloakClient.updateUser({
        id: user.id,
        email: command.email,
        firstname: command.firstname,
        lastname: command.lastname,
        universityLogin: user.attributes?.universityLogin,
        universityId: command.universityId,
        groups: [command.group],
      });

      await this.keycloakClient.addRealmRoleToUser(
        user.id,
        KeycloakRealmRoles.ADMIN,
      );
    }

    const hasCredentials = await this.hasCredentials(user.id);

    if (university.parent && !hasCredentials) {
      await this.keycloakClient.executeActionEmail(
        ['UPDATE_PASSWORD'],
        user.id,
        university.nativeLanguage.code === 'fr' ? 'fr' : 'en',
        this.env.get('ADMIN_URL'),
      );
    }

    return user;
  }

  private async getUniversity(id: string): Promise<University> {
    const university = await this.universityRepository.ofId(id);

    if (!university) {
      throw new RessourceDoesNotExist('University does not exist');
    }

    return university;
  }

  private async isAdministator(user: string) {
    const administrators = await this.keycloakClient.getAdministrators();

    const isAdministrator = administrators.some(
      (administrator) => administrator.id === user,
    );

    return isAdministrator;
  }

  private async hasCredentials(user: string) {
    const credentials = await this.keycloakClient.getUserCredentials(user);

    const hasCredentials = credentials.some(
      (credential) => credential.type === 'password',
    );

    return hasCredentials;
  }
}
