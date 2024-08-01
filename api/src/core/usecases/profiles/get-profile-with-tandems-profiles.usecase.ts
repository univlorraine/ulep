import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from '../../ports/profile.repository';

export type GetProfileWithTandemsProfilesCommand = {
  id: string;
};

@Injectable()
export class GetProfileWithTandemsProfilesUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfileWithTandemsProfilesCommand) {
    console.log('GetProfileWithTandemsProfilesUsecase');
    const profile = await this.profileRepository.ofIdWithTandemsProfiles(
      command.id,
    );

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    return profile;
  }
}
