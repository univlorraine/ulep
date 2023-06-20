import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { University } from 'src/core/models/university';
import { UniversityRepository } from 'src/core/ports/university.repository';
import { UNIVERSITY_REPOSITORY } from 'src/providers/providers.module';

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
      throw new NotFoundException(`University ${command.id} not found`);
    }

    const university = await this.universityRepository.ofName(command.name);
    if (university && university.id !== command.id) {
      throw new BadRequestException({ message: 'Field name must be unique' });
    }

    if (command.name) {
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
