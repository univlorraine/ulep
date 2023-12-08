import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
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
      const university = await this.universityRepository.ofId(
        command.universityId,
      );
      if (!university) {
        throw new RessourceDoesNotExist('University does not exist');
      }
    }

    const keycloakUser = await this.keycloakClient.createAdministrator({
      email: command.email,
      firstname: command.firstname,
      lastname: command.lastname,
      password: command.password,
      universityId: command.universityId,
    });

    await this.keycloakClient.addUserToAdministrators(keycloakUser.id);

    return keycloakUser;
  }
}
