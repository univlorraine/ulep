import { Inject, Injectable } from '@nestjs/common';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
  ProfileWithTandemsQueryWhere,
} from '../../ports/profile.repository';

export class GetProfilesWithTandemsCommand {
  page: number;
  limit: number;
  where?: ProfileWithTandemsQueryWhere;
}

@Injectable()
export class GetProfilesWithTandemsUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfilesWithTandemsCommand) {
    const { page, limit, where } = command;
    const offset = (page - 1) * limit;
    const result = await this.profileRepository.findAllWithTandems(
      offset,
      limit,
      where,
    );

    return result;
  }
}
