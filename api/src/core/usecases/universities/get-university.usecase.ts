import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { University } from 'src/core/models/university';
import { UniversityRepository } from 'src/core/ports/university.repository';
import { UNIVERSITY_REPOSITORY } from 'src/providers/providers.module';

export class GetUniversityCommand {
  id: string;
}

@Injectable()
export class GetUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: GetUniversityCommand): Promise<University> {
    const { id } = command;
    const university = await this.universityRepository.of(id);

    if (!university) {
      throw new NotFoundException();
    }

    return university;
  }
}
