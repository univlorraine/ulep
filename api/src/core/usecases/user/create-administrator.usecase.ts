import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { configuration } from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class CreateAdministratorCommand {
  email: string;
  universityId?: string;
}

@Injectable()
export class CreateAdministratorUsecase {
  constructor(
    private readonly keycloak: KeycloakClient,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: CreateAdministratorCommand) {
    const university = await this.universityRepository.ofId(
      command.universityId,
    );
    if (!university) {
      throw new RessourceDoesNotExist('University does not exist');
    }

    const keycloakUser = await this.keycloak.createAdministrator({
      email: command.email,
      universityId: command.universityId,
    });

    await this.keycloak.addUserToAdministrator(keycloakUser.id);

    console.warn(`${configuration().adminUrl}/login`);
    await this.keycloak.executeActionEmail(
      ['UPDATE_PASSWORD'],
      keycloakUser.id,
      `${configuration().adminUrl}/login`,
    );

    return keycloakUser;
  }
}
