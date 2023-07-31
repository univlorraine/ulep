import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';

@Injectable()
export class GetUniversitiesUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly repository: UniversityRepository,
  ) {}

  async execute() {
    const universities = await this.repository.findAll();

    return universities;
  }
}
