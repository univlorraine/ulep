import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

@Injectable()
export class GetUniversityDivisionsUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(universityId: string) {
    const university = await this.universityRepository.ofId(universityId);

    if (!university) {
      throw new RessourceDoesNotExist();
    }

    const usersFromUniversity = await this.userRepository.findByUniversityId(
      universityId,
    );

    const divisions = new Set<string>();
    usersFromUniversity.forEach((user) => {
      if (user.division) {
        divisions.add(user.division);
      }
    });

    return Array.from(divisions);
  }
}
