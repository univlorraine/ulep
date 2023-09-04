import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Campus } from 'src/core/models/campus.model';
import {
  CAMPUS_REPOSITORY,
  CampusRepository,
} from 'src/core/ports/campus.repository';

export class UpdateCampusCommand {
  id: string;
  name?: string;
}

@Injectable()
export class UpdateCampusUsecase {
  constructor(
    @Inject(CAMPUS_REPOSITORY)
    private readonly campusRepository: CampusRepository,
  ) {}

  async execute(command: UpdateCampusCommand) {
    const campus = await this.campusRepository.ofId(command.id);

    if (!campus) {
      throw new RessourceDoesNotExist('Campus does not exist');
    }

    return this.campusRepository.update(
      new Campus({
        id: campus.id,
        name: command.name,
        universityId: campus.universityId,
      }),
    );
  }
}
