import { Inject, Injectable } from '@nestjs/common';
import { UniversityDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';
import { UniversityRepository } from 'src/core/ports/university.repository';
import { UNIVERSITY_REPOSITORY } from 'src/providers/providers.module';

export class DeleteUniversityCommand {
  id: string;
}

@Injectable()
export class DeleteUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: DeleteUniversityCommand): Promise<void> {
    const { id } = command;
    const university = await this.universityRepository.ofId(id);

    if (!university) {
      throw UniversityDoesNotExist.withIdOf(id);
    }

    await this.universityRepository.delete(university);
  }
}
