import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class UpdateAdministratorCommand {
  id: string;
  email?: string;
  password?: string;
  universityId?: string;
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

    if (this.keycloakClient.getUserById(command.id)) {
      throw new RessourceDoesNotExist('Administrator does not exist');
    }

    const keycloakUser = await this.keycloakClient.updateAdministrator({
      id: command.id,
      email: command.email,
      password: command.password,
      universityId: command.universityId,
    });

    return keycloakUser;
  }
}
