import { Inject, Injectable } from '@nestjs/common';
import { SortOrderType } from '@app/common';
import {
  PROFILE_REPOSITORY,
  ProfileQueryWhere,
  ProfileRepository,
} from '../../ports/profile.repository';

export class GetProfilesCommand {
  page: number;
  limit: number;
  orderBy?: SortOrderType<string>;
  where?: ProfileQueryWhere;
}

@Injectable()
export class GetProfilesUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfilesCommand) {
    const { page, orderBy, limit, where } = command;
    const offset = (page - 1) * limit;
    const result = await this.profileRepository.findAll(
      offset,
      limit,
      orderBy,
      where,
    );

    return result;
  }
}
