import { Inject, Injectable } from '@nestjs/common';
import {
  ACTIVITY_REPOSITORY,
  ActivityPagination,
  ActivityRepository,
} from 'src/core/ports/activity.repository';

type GetAllActivityThemesCommand = {
  pagination?: ActivityPagination;
};

@Injectable()
export class GetAllActivityThemesUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(command: GetAllActivityThemesCommand) {
    const activityThemes = await this.activityRepository.allThemes(command);

    return activityThemes;
  }
}
