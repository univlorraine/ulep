import { Inject, Injectable } from '@nestjs/common';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from '../../ports/profile.repository';

export type GetProfilesSubscribedToEventCommand = {
  eventId: string;
};

@Injectable()
export class GetProfilesSubscribedToEventUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfilesSubscribedToEventCommand) {
    const profiles = await this.profileRepository.getProfilesSubscribedToEvent(
      command.eventId,
    );

    return profiles;
  }
}
