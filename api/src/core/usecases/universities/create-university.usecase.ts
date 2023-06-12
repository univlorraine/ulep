import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { University } from 'src/core/models/university';
import { UniversityRepository } from 'src/core/ports/university.repository';
import { UNIVERSITY_REPOSITORY } from 'src/providers/providers.module';

export class CreateUniversityCommand {
  name: string;
}

@Injectable()
export class CreateUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: CreateUniversityCommand): Promise<University> {
    const university = await this.universityRepository.findByName(command.name);
    if (university) {
      throw new BadRequestException({ message: 'University already exists' });
    }

    const instance = University.create(command.name);
    await this.universityRepository.save(instance);

    return instance;
  }
}
