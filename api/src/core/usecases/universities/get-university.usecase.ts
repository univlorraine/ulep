import { Inject, Injectable } from '@nestjs/common';
import { University } from '../../models/university';
import { UniversityRepository } from '../../ports/university.repository';
import { UNIVERSITY_REPOSITORY } from '../../../providers/providers.module';
import { UniversityDoesNotExist } from '../../../core/errors/RessourceDoesNotExist';

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
    const university = await this.universityRepository.ofId(id);

    if (!university) {
      throw UniversityDoesNotExist.withIdOf(id);
    }

    return university;
  }
}
