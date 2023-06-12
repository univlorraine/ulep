import { Inject, Injectable, Logger } from '@nestjs/common';
import { University } from 'src/core/models/university';
import { UniversityRepository } from 'src/core/ports/university.repository';
import { UNIVERSITY_REPOSITORY } from 'src/providers/providers.module';
import { Collection } from 'src/shared/types/collection';

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
