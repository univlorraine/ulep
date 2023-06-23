import { Inject, Injectable, Logger } from '@nestjs/common';
import { University } from '../../models/university';
import { UniversityRepository } from '../../ports/university.repository';
import { UNIVERSITY_REPOSITORY } from '../../../providers/providers.module';
import { Collection } from '../../../shared/types/collection';

export class GetUniversitiesCommand {
  page: number;
  limit: number;
}

@Injectable()
export class GetUniversitiesUsecase {
  private readonly logger = new Logger(GetUniversitiesUsecase.name);

  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(
    command: GetUniversitiesCommand,
  ): Promise<Collection<University>> {
    const { page, limit } = command;
    const offset = (page - 1) * limit;
    const result = await this.universityRepository.findAll(offset, limit);

    return result;
  }
}
