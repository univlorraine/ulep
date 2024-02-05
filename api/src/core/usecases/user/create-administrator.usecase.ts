import { KeycloakClient } from '@app/keycloak';
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
      user = await this.keycloakClient.createAdministrator({
        email: command.email,
        firstname: command.firstname,
        lastname: command.lastname,
        password: command.password,
        universityId: command.universityId,
      });
    } else {
      const isAdministator = await this.isAdministator(user.id);
      if (isAdministator) {
        throw new BadRequestException('User is already an administrator');
      }

      const hasCredentials = await this.hasCredentials(user.id);

      await this.keycloakClient.updateAdministrator({
        id: user.id,
        email: command.email,
        firstname: command.firstname,
        lastname: command.lastname,
        password: hasCredentials ? undefined : command.password,
        universityId: command.universityId,
      });
    }

    await this.keycloakClient.addUserToAdministrators(user.id);

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
