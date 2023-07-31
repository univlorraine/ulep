import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';

export class DeleteUniversityCommand {
  id: string;
}

@Injectable()
export class DeleteUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: DeleteUniversityCommand) {
    const instance = await this.universityRepository.ofId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    if (!instance.parent) {
      throw new DomainError({ message: 'Cannot delete root university' });
    }

    return this.universityRepository.remove(command.id);
  }
}
