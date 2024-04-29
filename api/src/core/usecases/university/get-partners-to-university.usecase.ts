import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Collection } from '@app/common';
import { UniversityResponse } from 'src/api/dtos';
import { KeycloakClient } from '@app/keycloak';

@Injectable()
export class GetPartnersToUniversityUsecase {
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

    let partnerUniversities = [];
    if (university.isCentralUniversity()) {
      partnerUniversities = (
        await this.universityRepository.findAll()
      ).items.filter((university) => !university.isCentralUniversity());
    } else {
      partnerUniversities = [
        await this.universityRepository.findUniversityCentral(),
      ];
    }

    return new Collection<UniversityResponse>({
      items: await Promise.all(
        partnerUniversities.map(async (university) => {
          const defaultKeycloakContact = university.defaultContactId
            ? await this.keycloakClient.getUserById(university.defaultContactId)
            : null;

          return UniversityResponse.fromUniversity(
            university,
            defaultKeycloakContact,
          );
        }),
      ),
      totalItems: partnerUniversities.length,
    });
  }
}
