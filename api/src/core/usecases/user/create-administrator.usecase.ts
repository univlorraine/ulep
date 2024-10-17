import {
  KeycloakClient,
  KeycloakGroup,
  KeycloakRealmRoles,
} from '@app/keycloak';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class CreateAdministratorCommand {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  universityId?: string;
  group: KeycloakGroup;
}

@Injectable()
export class CreateAdministratorUsecase {
  constructor(
    private readonly keycloakClient: KeycloakClient,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: CreateAdministratorCommand) {
    if (command.universityId) {
      await this.assertUniversityExist(command.universityId);
    }

    let user = await this.keycloakClient.getUserByEmail(command.email);

    if (!user) {
      // The realmRoles property to assign a role on user creation does not work
      // See the current issue : https://github.com/keycloak/keycloak/issues/13390
      user = await this.keycloakClient.createAdministrator({
        email: command.email,
        firstname: command.firstname,
        lastname: command.lastname,
        password: command.password,
        universityId: command.universityId,
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

      const hasCredentials = await this.hasCredentials(user.id);

      await this.keycloakClient.updateUser({
        id: user.id,
        email: command.email,
        firstname: command.firstname,
        lastname: command.lastname,
        password: hasCredentials ? undefined : command.password,
        universityLogin: user.attributes?.universityLogin,
        universityId: command.universityId,
        groups: [command.group],
      });

      await this.keycloakClient.addRealmRoleToUser(
        user.id,
        KeycloakRealmRoles.ADMIN,
      );
    }

    return user;
  }

  private async assertUniversityExist(id: string) {
    const university = await this.universityRepository.ofId(id);

    if (!university) {
      throw new RessourceDoesNotExist('University does not exist');
    }
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
