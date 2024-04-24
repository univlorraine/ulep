import { Injectable } from '@nestjs/common';
import { KeycloakClient } from '@app/keycloak';

@Injectable()
export class GetAdministratorUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(id: string) {
    const administrator = await this.keycloak.getUserById(id, true);

    return administrator;
  }
}
