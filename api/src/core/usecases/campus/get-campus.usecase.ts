import { Inject, Injectable } from '@nestjs/common';
import {
  CAMPUS_REPOSITORY,
  CampusRepository,
} from 'src/core/ports/campus.repository';
@Injectable()
export class GetCampusUsecase {
  constructor(
    @Inject(CAMPUS_REPOSITORY)
    private readonly campusRepository: CampusRepository,
  ) {}

  async execute() {
    return this.campusRepository.all();
  }
}
