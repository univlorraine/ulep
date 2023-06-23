import { Inject, Injectable } from '@nestjs/common';
import { ProfileRepository } from '../../ports/profile.repository';
import { PROFILE_REPOSITORY } from '../../../providers/providers.module';

export class GetProfilesCommand {
  page: number;
  limit: number;
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
    const result = await this.profileRepository.findAll(offset, limit);

    return result;
  }
}
