import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Collection } from '@app/common';
import { University } from 'src/core/models';

@Injectable()
export class GetPartnersToUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
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

    return new Collection<University>({
      items: partnerUniversities,
      totalItems: partnerUniversities.length,
    });
  }
}
