import { Inject, Injectable } from '@nestjs/common';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
  ProfileWithTandemsProfilesQueryWhere,
} from '../../ports/profile.repository';

export class GetProfilesWithTandemsProfilesCommand {
  page: number;
  limit: number;
  where?: ProfileWithTandemsProfilesQueryWhere;
}

@Injectable()
export class GetProfilesWithTandemsProfilesUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfilesWithTandemsProfilesCommand) {
    const { page, limit, where } = command;
    const offset = (page - 1) * limit;
    const result = await this.profileRepository.findAllWithTandemsProfiles(
      offset,
      limit,
      where,
    );

    return result;
  }
}
