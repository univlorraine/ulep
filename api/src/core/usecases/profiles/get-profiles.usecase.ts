import { Inject, Injectable } from '@nestjs/common';
import { SortOrderType, StringFilter } from '@app/common';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from '../../ports/profile.repository';

export class GetProfilesCommand {
  page: number;
  limit: number;
  orderBy?: SortOrderType<string>;
  email?: StringFilter;
}

@Injectable()
export class GetProfilesUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfilesCommand) {
    const { page, orderBy, limit } = command;
    const offset = (page - 1) * limit;
    const result = await this.profileRepository.findAll(
      offset,
      limit,
      orderBy,
      {
        email: command.email,
      },
    );

    return result;
  }
}
