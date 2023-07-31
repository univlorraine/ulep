import { Inject, Injectable } from '@nestjs/common';
import { StringFilter } from '@app/common';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from '../../ports/profile.repository';

export class GetProfilesCommand {
  page: number;
  limit: number;
  email?: StringFilter;
}

@Injectable()
export class GetProfilesUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfilesCommand) {
    const { page, limit } = command;
    const offset = (page - 1) * limit;
    const result = await this.profileRepository.findAll(offset, limit, {
      email: command.email,
    });

    return result;
  }
}
