import { KeycloakClient, KeycloakGroup } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class UpdateAdministratorCommand {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  universityId?: string;
  groups: KeycloakGroup[];
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

    const keycloakUser = await this.keycloakClient.updateUser({
      id: admin.id,
      firstname: command.firstname || admin.firstName,
      lastname: command.lastname || admin.lastName,
      email: command.email || admin.email,
      password: command.password,
      universityId: command.universityId,
      groups: command.groups,
    });

    return keycloakUser;
  }
}
