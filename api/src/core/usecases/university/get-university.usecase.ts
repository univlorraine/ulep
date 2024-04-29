import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { KeycloakClient } from '@app/keycloak';

@Injectable()
export class GetUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(id: string) {
    const university = await this.universityRepository.ofId(id);

    if (!university) {
      throw new RessourceDoesNotExist();
    }

    const defaultKeycloakContact = university.defaultContactId
      ? await this.keycloakClient.getUserById(university.defaultContactId)
      : null;

    if (!defaultKeycloakContact) {
      throw new RessourceDoesNotExist("Administrator contact doesn't exists.");
    }

    return { university, defaultKeycloakContact };
  }
}
