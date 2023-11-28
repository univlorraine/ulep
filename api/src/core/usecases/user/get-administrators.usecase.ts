import { Injectable } from '@nestjs/common';
import { KeycloakClient } from '@app/keycloak';

@Injectable()
export class GetAdministratorsUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(universityId?: string) {
    const result = await this.keycloak.getAdministrators(universityId);

    return result;
  }
}
