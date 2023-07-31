import { Inject, Injectable } from '@nestjs/common';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from '../../ports/profile.repository';
import { RessourceDoesNotExist } from 'src/core/errors';

export type GetProfileCommand = {
  id: string;
};

@Injectable()
export class GetProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfileCommand) {
    const profile = await this.profileRepository.ofId(command.id);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    return profile;
  }
}
