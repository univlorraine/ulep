import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { KeycloakClient } from '@app/keycloak';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Collection } from '@app/common';
import { UniversityResponse } from 'src/api/dtos';

@Injectable()
export class GetUniversitiesUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly repository: UniversityRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute() {
    const universities = await this.repository.findAll();

    return new Collection<UniversityResponse>({
      items: await Promise.all(
        universities.items.map(async (university) => {
          const defaultKeycloakContact = university.defaultContactId
            ? await this.keycloakClient.getUserById(university.defaultContactId)
            : null;

          return UniversityResponse.fromUniversity(
            university,
            defaultKeycloakContact,
          );
        }),
      ),
      totalItems: universities.totalItems,
    });
  }
}
