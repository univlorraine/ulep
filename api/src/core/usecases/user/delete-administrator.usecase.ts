import { Inject, Injectable } from '@nestjs/common';
import { KeycloakClient } from '@app/keycloak';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';

export class DeleteAdministratorCommand {
  id: string;
}

@Injectable()
export class DeleteAdministratorUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(command: DeleteAdministratorCommand) {
    const hasProfile = await this.profileRepository.ofUser(command.id);

    if (!hasProfile) {
      return this.keycloak.deleteUser(command.id);
    }

    await this.keycloak.removeUserFromAdministrators(command.id);
  }
}
