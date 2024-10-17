import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { SortOrder } from '@app/common';

type GetUniversitiesCommand = {
  orderBy?: {
    field: string;
    order: SortOrder;
  };
};

@Injectable()
export class GetUniversitiesUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly repository: UniversityRepository,
  ) {}

  async execute(command: GetUniversitiesCommand) {
    const universities = await this.repository.findAll(command);

    return universities;
  }
}
