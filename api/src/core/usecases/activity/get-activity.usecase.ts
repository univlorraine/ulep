import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';

@Injectable()
export class GetActivityUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(id: string) {
    const activity = await this.activityRepository.ofId(id);

    if (!activity) {
      throw new RessourceDoesNotExist();
    }

    return activity;
  }
}
