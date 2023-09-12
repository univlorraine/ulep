import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from '../../ports/profile.repository';

export type GetProfileUserIdCommand = {
  id: string;
};

@Injectable()
export class GetProfileByUserIdUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfileUserIdCommand) {
    const profile = await this.profileRepository.ofUser(command.id);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    return profile;
  }
}
