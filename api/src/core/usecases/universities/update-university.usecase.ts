import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { University } from '../../models/university';
import { UniversityRepository } from '../../ports/university.repository';
import { UNIVERSITY_REPOSITORY } from '../../../providers/providers.module';
import { UniversityDoesNotExist } from '../../../core/errors/RessourceDoesNotExist';

export class UpdateUniversityCommand {
  id: string;
  name?: string;
  admissionStart?: Date;
  admissionEnd?: Date;
}

@Injectable()
export class UpdateUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UpdateUniversityCommand): Promise<University> {
    const instance = await this.universityRepository.ofId(command.id);
    if (!instance) {
      throw UniversityDoesNotExist.withIdOf(command.id);
    }

    if (command.name) {
      const university = await this.universityRepository.ofName(command.name);
      if (university && university.id !== command.id) {
        throw new ConflictException({ message: 'Field name must be unique' });
      }

      instance.name = command.name;
    }

    if (command.admissionStart) {
      instance.admissionStart = command.admissionStart;
    }

    if (command.admissionEnd) {
      instance.admissionEnd = command.admissionEnd;
    }

    await this.universityRepository.save(instance);

    return instance;
  }
}
