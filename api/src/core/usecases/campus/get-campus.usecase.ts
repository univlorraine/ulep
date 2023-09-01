import { Inject, Injectable } from '@nestjs/common';
import {
  CAMPUS_REPOSITORY,
  CampusRepository,
} from 'src/core/ports/campus.repository';
import { SortOrder } from '@app/common';

export class GetCampusCommand {
  order?: SortOrder;
  page?: number;
  limit?: number;
}

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
