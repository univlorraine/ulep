import { Inject, Injectable } from '@nestjs/common';
import {
  CAMPUS_REPOSITORY,
  CampusRepository,
} from 'src/core/ports/campus.repository';

export class GetCampusByIdCommand {
  id: string;
}

@Injectable()
export class GetCampusByIdUsecase {
  constructor(
    @Inject(CAMPUS_REPOSITORY)
    private readonly campusRepository: CampusRepository,
  ) {}

  async execute(command: GetCampusByIdCommand) {
    return this.campusRepository.ofId(command.id);
  }
}
