import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

export class DeleteUniversityCommand {
  id: string;
}

@Injectable()
export class DeleteUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteUniversityCommand) {
    const instance = await this.universityRepository.ofId(command.id);
    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    if (!instance.parent) {
      throw new DomainError({ message: 'Cannot delete root university' });
    }

    await this.assertUniversityHaveNoPartnersUniversity(command.id);
    await this.assertUniversityHaveNoUsers(command.id);

    return this.universityRepository.remove(command.id);
  }

  private async assertUniversityHaveNoPartnersUniversity(id: string) {
    const havePartners = await this.universityRepository.havePartners(id);
    if (havePartners) {
      throw new DomainError({
        message: 'Cannot delete university with partners',
      });
    }
  }

  private async assertUniversityHaveNoUsers(id: string) {
    const countUsers = await this.userRepository.count({ universityId: id });
    if (countUsers > 0) {
      throw new DomainError({
        message: 'Cannot delete university with users',
      });
    }
  }
}
