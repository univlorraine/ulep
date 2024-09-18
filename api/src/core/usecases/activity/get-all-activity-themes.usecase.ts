import { Inject, Injectable } from '@nestjs/common';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';

@Injectable()
export class GetAllActivityThemesUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute() {
    const activityThemes = await this.activityRepository.allThemes();

    return activityThemes;
  }
}
