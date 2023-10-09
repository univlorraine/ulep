import { Injectable } from '@nestjs/common';
import { KeycloakClient } from '@app/keycloak';

@Injectable()
export class GetAdministratorsUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute() {
    const result = await this.keycloak.getAdministrators();

    return result;
  }
}
