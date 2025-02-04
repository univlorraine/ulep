import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { Administrator } from 'src/core/models';
import {
  MediaObjectRepository,
  MEDIA_OBJECT_REPOSITORY,
} from 'src/core/ports/media-object.repository';
import { GetLanguageUsecase } from '../language';
import { GetUniversityUsecase } from '../university';

@Injectable()
export class GetAdministratorUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    private readonly keycloak: KeycloakClient,
    private readonly getUniversityUsecase: GetUniversityUsecase,
    private readonly getLanguageUsecase: GetLanguageUsecase,
  ) {}

  async execute(id: string): Promise<Administrator> {
    const administrator = await this.keycloak.getUserById(id, true);

    let university = null;
    if (administrator.attributes?.universityId?.[0]) {
      university = await this.getUniversityUsecase.execute(
        administrator.attributes?.universityId?.[0],
      );
    }

    let language = null;
    if (administrator.attributes?.languageId?.[0]) {
      language = await this.getLanguageUsecase.execute({
        id: administrator.attributes?.languageId?.[0],
      });
    }

    return new Administrator({
      ...administrator,
      university,
      language,
      avatar: await this.mediaObjectRepository.findOne(administrator.id),
    });
  }
}
