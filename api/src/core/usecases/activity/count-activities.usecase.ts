import { Inject, Injectable } from '@nestjs/common';
import { ActivityStatus } from 'src/core/models/activity.model';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';

export class CountActivitiesCommand {
  profileId: string;
}

@Injectable()
export class CountActivitiesUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(command: CountActivitiesCommand) {
    const countActivities =
      await this.activityRepository.countActivitiesByProfileAndStatus(
        command.profileId,
        ActivityStatus.PUBLISHED,
      );

    return countActivities ?? 0;
  }
}
