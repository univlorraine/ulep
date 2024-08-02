import {
  KeycloakClient,
  KeycloakUser,
  UserRepresentation,
} from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import {
  AdministratorsQuery,
  UserRepresentationWithAvatar,
} from 'src/api/dtos';
import { AdminRole } from 'src/core/models';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';

@Injectable()
export class GetAdministratorsUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(
    user?: KeycloakUser,
    query?: AdministratorsQuery,
  ): Promise<UserRepresentationWithAvatar[]> {
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

    const administratorsWithGroupsAndAvatar = await Promise.all(
      administratorsWithGroups.map(async (administrator) => ({
        ...administrator,
        image: await this.mediaObjectRepository.findOne(administrator.id),
      })),
    );

    if (query) {
      return this.filterByQuery(administratorsWithGroupsAndAvatar, query);
    }

    if (user.realm_access.roles.includes(AdminRole.SUPER_ADMIN)) {
      return administratorsWithGroupsAndAvatar;
    }

    return this.filterByUniversity(
      administratorsWithGroupsAndAvatar,
      user.universityId,
    );
  }

  filterByQuery(
    administrators: UserRepresentationWithAvatar[],
    query: AdministratorsQuery,
  ) {
    let filteredAdministrators = [...administrators];

    if (query?.universityId) {
      filteredAdministrators = this.filterByUniversity(
        filteredAdministrators,
        query.universityId,
      );
    }

    if (query?.lastname) {
      filteredAdministrators = filteredAdministrators.filter((administrator) =>
        administrator.lastName
          .toLowerCase()
          .includes(query.lastname.toLowerCase()),
      );
    }

    if (query?.firstname) {
      filteredAdministrators = filteredAdministrators.filter((administrator) =>
        administrator.firstName
          .toLowerCase()
          .includes(query.firstname.toLowerCase()),
      );
    }

    if (query?.email) {
      filteredAdministrators = filteredAdministrators.filter((administrator) =>
        administrator.email.toLowerCase().includes(query.email.toLowerCase()),
      );
    }

    if (query?.groupId) {
      filteredAdministrators = filteredAdministrators.filter(
        (administrator) => administrator.groups[0].id === query.groupId,
      );
    }

    return filteredAdministrators;
  }

  filterByUniversity(
    administrators: UserRepresentationWithAvatar[],
    universityId: string,
  ) {
    return administrators.filter(
      (administrator) =>
        administrator.attributes?.universityId?.[0] === universityId,
    );
  }
}
