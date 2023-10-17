import { Injectable } from '@nestjs/common';
import { KeycloakClient } from '@app/keycloak';

export class DeleteAdministratorCommand {
  id: string;
}

@Injectable()
export class DeleteAdministratorUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: DeleteAdministratorCommand) {
    return this.keycloak.deleteAdministrator(command.id);
  }
}
