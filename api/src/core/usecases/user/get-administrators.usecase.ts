import { Injectable } from '@nestjs/common';
import {
  KeycloakClient,
  KeycloakGroup,
  KeycloakUser,
  UserRepresentation,
} from '@app/keycloak';
import { AdminGroup, AdminRole } from 'src/core/models';

@Injectable()
export class GetAdministratorsUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(user?: KeycloakUser) {
    const result = await this.keycloak.getAdministrators();

    const administratorsWithGroups = await Promise.all(
      result.map(
        async (administrator) =>
          ({
            ...administrator,
            groups: await this.keycloak.getUserGroups(administrator.id),
          } as UserRepresentation),
      ),
    );

    if (user.realm_access.roles.includes(AdminRole.SUPER_ADMIN)) {
      return administratorsWithGroups;
    }

    return this.filterByUniversity(administratorsWithGroups, user.universityId);
  }

  filterByUniversity(
    administrators: UserRepresentation[],
    universityId: string,
  ) {
    return administrators.filter(
      (administrator) =>
        administrator.attributes?.universityId == universityId &&
        administrator.groups?.some(
          (group) => group.name !== AdminGroup.SUPER_ADMIN,
        ),
    );
  }
}
