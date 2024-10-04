import { Inject, Injectable } from '@nestjs/common';
import {
  ACTIVITY_REPOSITORY,
  ActivityPagination,
  ActivityRepository,
} from 'src/core/ports/activity.repository';

interface GetActivitiesCommand {
  pagination: ActivityPagination;
}

@Injectable()
export class GetAllActivitiesByAdminUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(command: GetActivitiesCommand) {
    const activities = await this.activityRepository.all({
      pagination: command.pagination,
    });

    return activities;
  }
}
