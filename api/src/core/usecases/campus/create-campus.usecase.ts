import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from 'src/core/errors';
import { Campus } from 'src/core/models/campus.model';
import {
  CAMPUS_REPOSITORY,
  CampusRepository,
} from 'src/core/ports/campus.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';

export class CreateCampusCommand {
  name?: string;
}

@Injectable()
export class CreateCampusUsecase {
  constructor(
    @Inject(CAMPUS_REPOSITORY)
    private readonly campusRepository: CampusRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProvider,
  ) {}

  async execute(command: CreateCampusCommand) {
    const central = await this.universityRepository.findUniversityCentral();

    if (!central) {
      throw new DomainError({ message: 'Central university does not exists' });
    }

    return this.campusRepository.create(
      new Campus({
        id: this.uuidProvider.generate(),
        name: command.name,
        universityId: central.id,
      }),
    );
  }
}
