import { KeycloakClient } from '@app/keycloak';
import { Injectable } from '@nestjs/common';
import { AdminGroup } from 'src/core/models';

@Injectable()
export class GetKeycloakAdminGroupsUsecase {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  async execute() {
    const groups = await this.keycloakClient.getAllGroups();
    const adminGroupNames = Object.values(AdminGroup) as string[];

    return groups.filter((group) => adminGroupNames.includes(group.name));
  }
}
