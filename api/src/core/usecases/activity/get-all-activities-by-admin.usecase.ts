import { Inject, Injectable } from '@nestjs/common';
import { ActivityStatus } from 'src/core/models/activity.model';
import {
  ACTIVITY_REPOSITORY,
  ActivityPagination,
  ActivityRepository,
} from 'src/core/ports/activity.repository';

interface GetActivitiesCommand {
  pagination: ActivityPagination;
  searchTitle?: string;
  languageCode?: string;
  languageLevel?: string;
  category?: string;
  status?: ActivityStatus;
}

@Injectable()
export class GetAllActivitiesByAdminUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(command: GetActivitiesCommand) {
    const activities = await this.activityRepository.allWithThemeWithCategory({
      searchTitle: command.searchTitle,
      pagination: command.pagination,
      languageCode: command.languageCode,
      languageLevel: command.languageLevel,
      category: command.category,
      status: command.status,
    });

    return activities;
  }
}
