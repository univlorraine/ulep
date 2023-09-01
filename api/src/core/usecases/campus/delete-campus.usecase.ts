import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  CAMPUS_REPOSITORY,
  CampusRepository,
} from 'src/core/ports/campus.repository';

export class DeleteCampusCommand {
  id: string;
}

@Injectable()
export class DeleteCampusUsecase {
  constructor(
    @Inject(CAMPUS_REPOSITORY)
    private readonly campusRepository: CampusRepository,
  ) {}

  async execute(command: DeleteCampusCommand) {
    const campus = await this.campusRepository.ofId(command.id);

    if (!campus) {
      throw new RessourceDoesNotExist('Campus does not exist');
    }

    return this.campusRepository.delete(command.id);
  }
}
