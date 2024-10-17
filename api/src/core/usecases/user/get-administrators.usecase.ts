import { KeycloakClient, KeycloakUser } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import {
  AdministratorsQuery,
  UserRepresentationWithAvatar,
} from 'src/api/dtos';
import { AdminRole } from 'src/core/models';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';

@Injectable()
export class GetAdministratorsUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(
    user?: KeycloakUser,
    query?: AdministratorsQuery,
  ): Promise<UserRepresentationWithAvatar[]> {
    const result = await this.keycloak.getAdministrators();

    const administrators = await Promise.all(
      result.map(
        async (administrator) =>
          ({
            ...administrator,
            groups: await this.keycloak.getUserGroups(administrator.id),
            image: await this.mediaObjectRepository.findOne(administrator.id),
            language: administrator.attributes?.languageId?.[0]
              ? await this.languageRepository.ofId(
                  administrator.attributes?.languageId?.[0],
                )
              : undefined,
          } as UserRepresentationWithAvatar),
      ),
    );

    if (query) {
      return this.filterByQuery(administrators, query);
    }

    if (user.realm_access.roles.includes(AdminRole.SUPER_ADMIN)) {
      return administrators;
    }

    return this.filterByUniversity(administrators, user.universityId);
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
