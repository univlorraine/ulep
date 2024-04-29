import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { KeycloakClient } from '@app/keycloak';
import { Collection } from '@app/common';
import { UniversityWithKeycloakContact } from 'src/core/models';

@Injectable()
export class GetUniversitiesUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly repository: UniversityRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute() {
    const universities = await this.repository.findAll();

    return new Collection<UniversityWithKeycloakContact>({
      items: await Promise.all(
        universities.items.map(async (university) => {
          const defaultKeycloakContact = university.defaultContactId
            ? await this.keycloakClient.getUserById(university.defaultContactId)
            : null;

          return new UniversityWithKeycloakContact({
            ...university,
            defaultContact: defaultKeycloakContact,
          });
        }),
      ),
      totalItems: universities.totalItems,
    });
  }
}
