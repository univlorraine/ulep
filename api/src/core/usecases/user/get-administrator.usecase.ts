import { Inject, Injectable } from '@nestjs/common';
import { KeycloakClient } from '@app/keycloak';
import { UserRepresentationWithAvatar } from 'src/api/dtos/users';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';

@Injectable()
export class GetAdministratorUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(id: string): Promise<UserRepresentationWithAvatar> {
    const administrator = await this.keycloak.getUserById(id, true);

    return {
      ...administrator,
      image: await this.mediaObjectRepository.findOne(administrator.id),
    };
  }
}
