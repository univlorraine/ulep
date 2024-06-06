import { Inject, Injectable } from '@nestjs/common';
import {
  KeycloakClient,
  KeycloakUser,
  UserRepresentation,
} from '@app/keycloak';
import { AdminGroup, AdminRole } from 'src/core/models';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';
import { UserRepresentationWithAvatar } from 'src/api/dtos';

@Injectable()
export class GetAdministratorsUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(
    user?: KeycloakUser,
    universityId?: string,
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

    if (universityId) {
      return this.filterByUniversity(
        administratorsWithGroupsAndAvatar,
        universityId,
      );
    }

    if (user.realm_access.roles.includes(AdminRole.SUPER_ADMIN)) {
      return administratorsWithGroupsAndAvatar;
    }

    return this.filterByUniversity(
      administratorsWithGroupsAndAvatar,
      user.universityId,
    );
  }

  filterByUniversity(
    administrators: UserRepresentationWithAvatar[],
    universityId: string,
  ) {
    return administrators.filter(
      (administrator) =>
        administrator.attributes?.universityId[0] === universityId,
    );
  }
}
