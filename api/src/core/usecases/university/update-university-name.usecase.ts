import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { RessourceDoesNotExist } from 'src/core/errors';

export class UpdateUniversityNameCommand {
  id: string;
  name: string;
}

@Injectable()
export class UpdateUniversityNameUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UpdateUniversityNameCommand) {
    const instance = await this.universityRepository.ofId(command.id);
    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return this.universityRepository.update(command.id, command.name);
  }
}
